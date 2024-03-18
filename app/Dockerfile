FROM node:lts-alpine

WORKDIR /usr/src/app

COPY . .

RUN npm install

EXPOSE 1337

CMD ["tail", "-f", "/dev/null"]