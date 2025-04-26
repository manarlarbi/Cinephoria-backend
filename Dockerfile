FROM node:18


WORKDIR /App


COPY package.json ./


RUN npm install


COPY . .

EXPOSE 3033


CMD ["node", "src/server.js"]