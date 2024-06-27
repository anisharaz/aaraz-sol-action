FROM node:latest AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build


FROM node:20.11.1-alpine3.19 AS runner
WORKDIR /app
COPY . .
RUN mkdir dist
COPY --from=builder /app/dist/ ./dist
RUN npm install --only=production
ENTRYPOINT [ "node","dist/index.js" ]