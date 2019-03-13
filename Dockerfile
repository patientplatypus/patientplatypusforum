FROM node:10

# Setting working directory. All the path will be relative to WORKDIR
# VOLUME [ "/usr/src/app" ]
WORKDIR /usr/src/app

# Installing dependencies
COPY package*.json ./
RUN npm install

# Copying source files
COPY . .

VOLUME /docker_volume

# Building app
RUN npm run build

EXPOSE 3000

# Running the app
CMD [ "npm", "start" ]