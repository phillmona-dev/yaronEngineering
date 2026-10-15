# ---- build ----
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /workspace
COPY pom.xml .
RUN mvn -q -B dependency:go-offline
COPY src ./src
RUN mvn -q -B -DskipTests package

# ---- runtime ----
FROM eclipse-temurin:21-jre
RUN useradd --system --uid 1001 --create-home app
WORKDIR /app
COPY --from=build /workspace/target/blog-api-*.jar app.jar
RUN mkdir -p /app/data/media && chown -R app:app /app
USER app
ENV MEDIA_STORAGE_PATH=/app/data/media
EXPOSE 8080
ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75", "-jar", "/app/app.jar"]
