#!/bin/sh

echo 'Starting vanPJ'
cd /home/pi/vanPJ
rm -rf package-lock.json
git fetch
git pull

/home/pi/.nvm/versions/node/v14.18.1/bin/node /home/pi/.nvm/versions/node/v14.18.1/bin/npm start --scripts-prepend-node-path
