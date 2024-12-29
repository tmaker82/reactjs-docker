FROM node:12-alpine as builder
WORKDIR /app
COPY package.json /app/package.json
RUN NODE_ENV=development npm i
COPY .. /app
RUN npm run build
FROM node:12-alpine
WORKDIR /app
COPY --from=builder /app/build /app
COPY package.json /app/package.json
RUN npm install --only=prod
EXPOSE 8080
USER node
CMD ["node", "index.html"]