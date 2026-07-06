FROM maven:3.9-eclipse-temurin-24 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn -B dependency:go-offline
COPY src src
RUN mvn -B package -DskipTests

# Reuses the same Maven+JDK image for the runtime stage: "eclipse-temurin:24-jre"
# alone consistently failed to pull on Railway's build infra with registry blob
# errors, while this tag has pulled reliably. Trades a larger image for a build
# that actually works.
FROM maven:3.9-eclipse-temurin-24
# psql/pg_dump are required by the backup & restore (recovery) feature.
RUN apt-get update \
    && apt-get install -y --no-install-recommends postgresql-client \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --from=build /app/target/tech-store-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
