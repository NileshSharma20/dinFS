# Dockerfile

FROM node:18.16.0-alpine3.17
# RUN mkdir -p /opt/app
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD [ "node", "server.js"]