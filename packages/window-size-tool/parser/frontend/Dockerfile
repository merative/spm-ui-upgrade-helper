FROM node:alpine

WORKDIR /app
COPY ./src /app/src

COPY ./package.json .
RUN npm install
COPY . .

CMD ["npm", "start"]