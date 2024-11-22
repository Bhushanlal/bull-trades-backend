
## Installation using docker

FROM node:20

WORKDIR /usr/app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 8005

CMD [ "npm", "start" ]


<!-- date and time format throughout the app -->
Date - yyyy/dd/mm/
<!-- 24 hours date format -->
Time - HH:mm:ss 