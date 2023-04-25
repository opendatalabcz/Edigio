FROM amazoncorretto:17-alpine3.17 AS BUILD
COPY . .
RUN ls .
RUN ./gradlew build -x test
ENTRYPOINT ["java", "-jar", "./build/libs/egidio-backend-0.0.1-SNAPSHOT.jar"]