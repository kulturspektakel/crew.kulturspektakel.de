#!/bin/bash
set -e

yarn install --production
# yarn node-pre-gyp rebuild -C ./node_modules/argon2
cp ~/argon2.node /var/www/virtual/kultursp/cms.kulturspektakel.de/node_modules/argon2/lib/binding/napi-v3/argon2.node
supervisorctl restart cms