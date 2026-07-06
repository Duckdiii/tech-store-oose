FROM --platform=linux/amd64 maven:3.9-eclipse-temurin-24 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn -B dependency:go-offline
COPY src src
RUN mvn -B package -DskipTests

FROM --platform=linux/amd64 maven:3.9-eclipse-temurin-24
# Reuses the same base image as the build stage: it's a Maven+JDK image (not a
# slim JRE), but "eclipse-temurin:24-jre" alone has been consistently failing
# to pull on Railway's build infra with registry blob errors, while this tag
# has pulled successfully every time. Trade a larger image for a build that works.
# psql/pg_dump are required by the backup & restore (recovery) feature.
RUN apt-get update \
    && apt-get install -y --no-install-recommends postgresql-client \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
