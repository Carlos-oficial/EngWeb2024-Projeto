FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

ENV MONGO_URI "mongodb://mongodb:27017/app?directConnection=true&serverSelectionTimeoutMS=30000&appName=mongosh+2.2.6"

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]