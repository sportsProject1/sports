# 1단계: Gradle과 Java 17이 포함된 이미지로 빌드
FROM gradle:7.6-jdk17 AS build
WORKDIR /app
COPY . .
RUN gradle build -x test --no-daemon

# 2단계: 빌드된 JAR 파일을 실행할 경량 Java 17 환경 설정
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar

# Render에서 일반적으로 사용되는 포트 8080과 HTTPS용 포트 443 추가
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
s
