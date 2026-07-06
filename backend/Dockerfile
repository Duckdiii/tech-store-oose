FROM maven:3.9-eclipse-temurin-24
# psql/pg_dump are required by the backup & restore (recovery) feature.
RUN apt-get update \
    && apt-get install -y --no-install-recommends postgresql-client \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY pom.xml .
RUN mvn -B dependency:go-offline
COPY src src
RUN mvn -B package -DskipTests
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "target/tech-store-0.0.1-SNAPSHOT.jar"]
