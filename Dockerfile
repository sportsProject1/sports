# 1단계: Gradle과 Java 17을 사용하여 빌드
FROM gradle:7.6-jdk17 AS build
WORKDIR /app
COPY . .
RUN gradle build -x test --no-daemon

# 2단계: 빌드된 JAR 파일을 실행할 경량화된 Java 환경
FROM openjdk:17-jdk-slim
WORKDIR /app

# 빌드 결과물을 실행 환경으로 복사
COPY --from=build /app/build/libs/*.jar app.jar

# Render에서 사용하는 기본 포트
EXPOSE 8080

# 애플리케이션 실행 명령
ENTRYPOINT ["java", "-jar", "app.jar"]
