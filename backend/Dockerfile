FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . ./

FROM node:18-alpine
WORKDIR /app
COPY --from=build /app .
ENV NODE_ENV=production
EXPOSE 5000
CMD ["node", "server.js"]
