FROM maven:3.9-eclipse-temurin-24
# psql/pg_dump are required by the backup & restore (recovery) feature.
RUN apt-get update \
    && apt-get install -y --no-install-recommends postgresql-client \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app
# Single COPY of the whole build context — splitting this into separate
# `COPY pom.xml .` + `COPY src src` steps consistently failed on Railway's
# build infra with "failed to calculate checksum ... /src: not found" even
# across fresh builders/services, so we trade away dependency-layer caching
# for a build that actually completes.
COPY . .
# Diagnostic: reveal exactly what the build context placed under /app so we
# know whether pom.xml landed at /app/pom.xml or one level deeper (e.g. if
# the build context root turns out to be the repo root, not backend/).
RUN echo "--- /app contents ---" && ls -la /app && find /app -maxdepth 3 -name pom.xml
RUN mvn -B package -DskipTests
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "target/tech-store-0.0.1-SNAPSHOT.jar"]
