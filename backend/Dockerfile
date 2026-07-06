FROM maven:3.9-eclipse-temurin-24
# psql/pg_dump are required by the backup & restore (recovery) feature.
RUN apt-get update \
    && apt-get install -y --no-install-recommends postgresql-client \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY pom.xml .
RUN mvn -B dependency:go-offline
# Cache-buster: bump this value if the build platform ever serves a stale
# cached layer for the COPY below (invalidates everything from here on).
ARG CACHE_BUST=1
RUN echo "cache bust: ${CACHE_BUST}"
COPY src src
RUN mvn -B package -DskipTests
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "target/tech-store-0.0.1-SNAPSHOT.jar"]
