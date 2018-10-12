FROM node:8-alpine
LABEL maintainer "Josh Ghent <me@joshghent.com>"

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Compile the app
RUN npm run build

# Remove Dev dependancies
RUN npm prune --production

ENV PORT=8000
EXPOSE 8000

CMD [ "npm", "start" ]
