# Use a base image with Node.js
FROM node:18

WORKDIR /app

COPY ./package*.json ./
COPY ./lerna*.json ./
COPY ./eslintrc*.json ./

RUN yarn

COPY ./packages/backend/package*.json ./packages/backend/

RUN cd ./packages/backend && yarn

COPY ./packages/frontend/package*.json ./packages/frontend/

RUN cd ./packages/frontend && yarn

COPY ./packages/backend ./packages/backend
COPY ./packages/frontend ./packages/frontend

EXPOSE 4200
EXPOSE 3000

# Set the default command to start both backend and frontend
CMD ["yarn", "start"]
