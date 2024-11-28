# 1단계: Gradle과 Java 17이 포함된 이미지를 사용하여 빌드
FROM gradle:7.6-jdk17 AS build
WORKDIR /app
COPY . .
RUN gradle build -x test --no-daemon

# 2단계: 빌드된 JAR 파일을 실행할 경량화된 Java 17 환경 설정
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
