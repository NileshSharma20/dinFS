# Dockerfile

FROM node:18.16.0-alpine3.17
<<<<<<< HEAD
RUN mkdir -p /opt/app
WORKDIR /opt/app
COPY src/package.json src/package-lock.json
RUN npm install
COPY src/ .
EXPOSE 3000
CMD [ "npm", "start"]
=======
# RUN mkdir -p /opt/app
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD [ "node", "server.js"]
>>>>>>> main
