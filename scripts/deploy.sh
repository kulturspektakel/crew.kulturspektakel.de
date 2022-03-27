#!/bin/bash
set -e

yarn install --production
yarn node-pre-gyp rebuild -C ./node_modules/argon2
supervisorctl restart cms