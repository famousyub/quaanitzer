# WE include all of JRE which is huge but in the future we can do something like this:
# https://stackoverflow.com/questions/53669151/java-11-application-as-lightweight-docker-image

FROM openjdk:11-jre
LABEL maintainer="ayoubjobs.2019@gmail.com"

ARG PORT
ARG PORT_DEBUG
ARG JAR_FILE
ARG XMS
ARG XMX

RUN mkdir -p /dev-resource-base
RUN echo "dummy" > /dev-resource-base/dummy.txt

RUN mkdir -p /loader-path
RUN echo "dummy" > /loader-path/dummy.txt

EXPOSE ${PORT}
EXPOSE ${PORT_DEBUG}
EXPOSE 4001
# Swarm UDP; should be exposed to the public
EXPOSE 4001/udp

COPY ${JAR_FILE} app.jar
RUN sh -c 'touch app.jar' 

COPY ./entrypoint.sh entrypoint.sh
RUN ["chmod", "+x", "entrypoint.sh"]
ENTRYPOINT ["./entrypoint.sh"]

# I had this format for a long time, but then noticed IPFS container was failing finding /bin/bash so I moved to the simpler shell script command above
# ENTRYPOINT ["/bin/bash", "-c", "/quanta/entrypoint.sh"]

# This works too but it's more flexible to just put the commands in 'entrypoint.sh'
# ENTRYPOINT ["/bin/bash", "-c", "java -Xms${XMS} -Xmx${XMX} -Dloader.path=/loader-path -Djava.security.egd=file:/dev/./urandom -jar /quanta/app.jar"]
