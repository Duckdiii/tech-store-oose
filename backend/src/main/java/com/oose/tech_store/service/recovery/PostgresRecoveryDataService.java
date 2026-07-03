package com.oose.tech_store.service.recovery;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class PostgresRecoveryDataService {

    @Value("${spring.datasource.url}")
    private String jdbcUrl;

    @Value("${spring.datasource.username}")
    private String username;

    @Value("${spring.datasource.password}")
    private String password;

    @Value("${app.recovery.postgres.bin-dir:}")
    private String binDir;

    public String backup() {
        String dbUrl = getPostgresConnectionUri();
        String pgDumpCmd = getExecutablePath("pg_dump");

        List<String> command = new ArrayList<>();
        command.add(pgDumpCmd);
        command.add("-d");
        command.add(dbUrl);
        command.add("-U");
        command.add(username);
        command.add("-F");
        command.add("p"); // Plain text SQL format
        command.add("-n");
        command.add("public"); // Only dump the public schema (app tables) to speed up and reduce size
        command.add("--clean"); // Clean (drop) database objects before recreating
        command.add("--if-exists"); // Use IF EXISTS when dropping objects

        try {
            return executeCommand(command, null);
        } catch (IOException | InterruptedException exception) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException("Failed to execute pg_dump for backup", exception);
        }
    }

    public void restore(String sqlContent) {
        String dbUrl = getPostgresConnectionUri();
        String psqlCmd = getExecutablePath("psql");

        List<String> command = new ArrayList<>();
        command.add(psqlCmd);
        command.add("-d");
        command.add(dbUrl);
        command.add("-U");
        command.add(username);

        try {
            executeCommand(command, sqlContent);
        } catch (IOException | InterruptedException exception) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException("Failed to execute psql for restore", exception);
        }
    }

    private String getPostgresConnectionUri() {
        if (jdbcUrl == null || !jdbcUrl.startsWith("jdbc:postgresql://")) {
            throw new IllegalStateException("Invalid spring.datasource.url: " + jdbcUrl);
        }
        // Transform "jdbc:postgresql://..." to "postgresql://..."
        return jdbcUrl.replace("jdbc:postgresql://", "postgresql://");
    }

    private String getExecutablePath(String command) {
        String os = System.getProperty("os.name").toLowerCase();
        String suffix = os.contains("win") ? ".exe" : "";
        if (binDir == null || binDir.isBlank()) {
            return command + suffix;
        }
        java.nio.file.Path path = java.nio.file.Path.of(binDir).resolve(command + suffix);
        return path.toAbsolutePath().toString();
    }

    private String executeCommand(List<String> command, String inputForStdin) throws IOException, InterruptedException {
        ProcessBuilder pb = new ProcessBuilder(command);
        pb.environment().put("PGPASSWORD", password);
        Process process = pb.start();

        // Drain stdout/stderr on their own threads *concurrently* with writing stdin below.
        // If read sequentially instead, a large dump/restore payload can fill the OS pipe
        // buffers for stdout/stderr while we are still blocked writing stdin (or blocked
        // reading stdout before we ever get to stderr), causing the child process and this
        // thread to deadlock on each other forever.
        StreamReaderTask stdoutReader = new StreamReaderTask(process.getInputStream());
        StreamReaderTask stderrReader = new StreamReaderTask(process.getErrorStream());
        Thread stdoutThread = new Thread(stdoutReader, "recovery-stdout-reader");
        Thread stderrThread = new Thread(stderrReader, "recovery-stderr-reader");
        stdoutThread.start();
        stderrThread.start();

        IOException stdinException = null;
        try (OutputStream os = process.getOutputStream()) {
            if (inputForStdin != null) {
                os.write(inputForStdin.getBytes(StandardCharsets.UTF_8));
                os.flush();
            }
        } catch (IOException exception) {
            stdinException = exception;
        }

        stdoutThread.join();
        stderrThread.join();
        int exitCode = process.waitFor();

        if (stdoutReader.getError() != null) {
            throw stdoutReader.getError();
        }
        if (stderrReader.getError() != null) {
            throw stderrReader.getError();
        }

        String stdout = stdoutReader.getOutput();
        String stderr = stderrReader.getOutput();

        if (exitCode != 0) {
            throw new IllegalStateException("Database CLI execution failed with exit code " + exitCode + "\nError: " + stderr);
        }
        if (stdinException != null) {
            throw stdinException;
        }

        return stdout;
    }

    private static final class StreamReaderTask implements Runnable {
        private final InputStream inputStream;
        private volatile String output = "";
        private volatile IOException error;

        private StreamReaderTask(InputStream inputStream) {
            this.inputStream = inputStream;
        }

        @Override
        public void run() {
            try (InputStream is = inputStream) {
                output = new String(is.readAllBytes(), StandardCharsets.UTF_8);
            } catch (IOException exception) {
                error = exception;
            }
        }

        String getOutput() {
            return output;
        }

        IOException getError() {
            return error;
        }
    }
}
