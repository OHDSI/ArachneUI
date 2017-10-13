#! /bin/bash
export NODE_ENV=production
export PORT=8181
export APIPORT=8080
export APP_TYPE=central
exec node /opt/bin/index.js
exit 0