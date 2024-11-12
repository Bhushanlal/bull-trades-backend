
## Installation using docker

FROM node:20

WORKDIR /usr/app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 8005

CMD [ "npm", "start" ]
