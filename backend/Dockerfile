# Multi-stage build for Spring Boot backend
FROM maven:3.9-eclipse-temurin-21 AS builder

WORKDIR /app

# Copy pom.xml and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and build
COPY src ./src
RUN mvn clean package -DskipTests

# Runtime stage - distroless for minimal footprint (Koyeb free-tier optimized)
FROM gcr.io/distroless/java21-debian12:nonroot

WORKDIR /app

# Copy jar from builder stage
COPY --from=builder /app/target/*.jar app.jar

# Copy .env.example for reference (optional)
COPY .env.example .env.example

# Expose port (default 8080, can be overridden by PORT env)
EXPOSE 8080

# JVM memory tuning for resource-constrained environments (Koyeb free-tier)
# - MaxRAMPercentage: use up to 70% of container memory
# - InitialRAMPercentage: start with 30% for faster startup
# - UseSerialGC: single-threaded GC for low memory footprint
ENV JAVA_TOOL_OPTIONS="-XX:MaxRAMPercentage=70 -XX:InitialRAMPercentage=30 -XX:+UseSerialGC"
ENV PORT=8080

# Run Spring Boot app
# User is 'nonroot' (UID 65532) for security
ENTRYPOINT ["java", "-jar", "app.jar"]

