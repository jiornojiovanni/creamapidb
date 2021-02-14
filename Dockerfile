FROM node:14
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only=production
RUN apt-get -y update && apt-get -y install lib32gcc1
COPY . .
CMD [ "node", "-r", "esm", "index.js" ]