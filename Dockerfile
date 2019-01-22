FROM openjdk:11-slim
VOLUME /tmp
ADD ../target/jacksonrce-fullapp-*.war jacksonrce-fullapp.war
RUN bash -c 'touch /jacksonrce-fullapp.war'
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/jacksonrce-fullapp.war"]