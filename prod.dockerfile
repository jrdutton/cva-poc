##### Stage 1
FROM node:latest as node
LABEL author="James Dutton"
WORKDIR /app
COPY package.json package.json
RUN npm install
COPY . .
RUN npm run build -- --prod