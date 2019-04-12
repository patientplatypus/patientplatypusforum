
FROM mongo

# Workdir configs directory
WORKDIR /usr/src/configs

# Copy config files
COPY mongod.conf .

EXPOSE 27017

CMD ["--config", "./mongod.conf"]