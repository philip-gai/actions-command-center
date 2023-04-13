#!/bin/bash

set -e

# Install additional packages

npm i -g install azure-functions-core-tools@4 --unsafe-perm true
func --version || true

cd web
ng completion || true
cd - > /dev/null
