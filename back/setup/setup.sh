#!/bin/bash

echo ******************************************************
echo Starting the replica set
echo ******************************************************

sleep 360 | echo Sleeping
mongo mongodb://mongo1:27017 replicaSet.js