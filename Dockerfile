FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN apk add --no-cache npm

RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]