FROM node:16.17.1-alpine3.16
# we want to have nodejs as a base image so that we have nodejs available in our container

ARG USER=docker
ARG UID=231072
ARG GID=231072

RUN addgroup -S ${USER} -g ${GID} \
&& adduser -S -G ${USER} -u ${UID} ${USER}

WORKDIR /server/${USER}
# we have a certain directory in the container file system (every container has it own file system)

COPY package.json .
#copy all the code

RUN npm install
#install all the dependencies our application needs

COPY . .
#copy all the code


EXPOSE 3001
#expose port 3001 to the outside world(wanna reach this port from outside the container)

CMD [ "node", "server.js" ]

USER ${USER}
