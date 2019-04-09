# Set the base image to Ubuntu
FROM ubuntu:18.04

LABEL Author="PatientPlatypus"

# Install Node.js and other dependencies
RUN apt-get update
RUN apt-get -y install curl
RUN apt-get -y install git
RUN apt-get -y install wget
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash - \
    && apt-get install -y nodejs

# Install PM2
RUN npm install -g pm2

RUN mkdir -p /var/www/back

# Define working directory
WORKDIR /var/www/back

ADD . /var/www/back

RUN npm install

COPY docker-entrypoint.sh /
ENTRYPOINT ["/docker-entrypoint.sh"]

# Expose port
EXPOSE 8000

# Run app
CMD pm2 start --no-daemon processes.json