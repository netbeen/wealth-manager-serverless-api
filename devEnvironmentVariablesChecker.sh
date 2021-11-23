#! /bin/bash
if [ -z "$MONGO_PASSWORD" ]; then
    echo "Need to set Environment Variable: MONGO_PASSWORD, the value is your MongoDB Password"
    exit 1
fi
if [ -z "$JWT_SECRET" ]; then
  echo "Need to set Environment Variable: JWT_SECRET, the value is the secret of jwt"
  exit 1
fi
if [ -z "$REDIS_PASSWORD" ]; then
  echo "Need to set Environment Variable: REDIS_PASSWORD, the value is the password of redis"
  exit 1
fi
