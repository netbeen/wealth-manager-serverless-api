#! /bin/bash
if [ -z "$MONGO_PASSWORD" ]; then
    echo "Need to set Environment Variable: MONGO_PASSWORD, the value is your MongoDB Password"
    exit 1
fi
