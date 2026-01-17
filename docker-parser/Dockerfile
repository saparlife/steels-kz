FROM node:20-alpine

WORKDIR /app

COPY package.json ./
RUN npm install

COPY parse-products.ts ./

CMD ["npx", "tsx", "parse-products.ts"]
