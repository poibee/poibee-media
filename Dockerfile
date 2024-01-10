# https://github.com/dinhtrivonguyen/nestjs-docker/blob/master/Dockerfile
FROM node:18-alpine AS development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install glob rimraf

RUN npm install --only=development

COPY . .

RUN npm run build

# --- start production image
FROM cypress/included:13.6.2 AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

COPY package*.json ./

RUN npm install --only=production

COPY . .

COPY --from=development /usr/src/app/dist ./dist

ENTRYPOINT ["node", "dist/src/main"]
