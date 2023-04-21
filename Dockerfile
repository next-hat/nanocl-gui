FROM node:18.16.0-slim as builder

USER node

# Create app directory (with user `node`)
RUN mkdir -p /home/node/app

# Set working directory
WORKDIR /home/node/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY --chown=node package*.json ./

ENV NODE_ENV=production

# Install dependencies
RUN npm install

# Bundle app source code
COPY --chown=node . .

RUN npm run build

FROM nginx:1.23.2-alpine

WORKDIR /etc/nginx/conf.d

COPY --from=builder /home/node/app/dist /home/node/app

COPY ./server.nginx ./default.conf
