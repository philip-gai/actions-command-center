#!/bin/bash

set -e

# Install additional packages

# Check for azure-functions-core-tools
# npm i -g azure-functions-core-tools@4 --unsafe-perm true
brew tap azure/functions
brew install azure-functions-core-tools@4
func --version || true
