#!/bin/bash

docker volume prune -f
docker kill $(docker ps -q)
docker rm $(docker ps -a -q)

docker build -t front .
docker run -it -p 3000:3000 front