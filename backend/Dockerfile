FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
COPY backend/package.json backend/
COPY frontend/package.json frontend/
RUN npm ci -w backend
COPY backend backend
RUN npm run build -w backend

FROM node:24-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
COPY backend/package.json backend/
COPY frontend/package.json frontend/
RUN npm ci -w backend --omit=dev
COPY --from=build /app/backend/dist backend/dist
WORKDIR /app/backend
EXPOSE 3001
CMD ["node", "dist/main"]
