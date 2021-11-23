#! /bin/bash
if [ -z "$UDEV_MONGO_PASSWORD" ]; then
  echo "Need to set Environment Variable: UDEV_MONGO_PASSWORD, the value is your MongoDB Password"
  exit 1
fi
if [ -z "$UDEV_JWT_SECRET" ]; then
  echo "Need to set Environment Variable: UDEV_JWT_SECRET, the value is the secret of jwt"
  exit 1
fi
if [ -z "$UDEV_REDIS_PASSWORD" ]; then
  echo "Need to set Environment Variable: UDEV_REDIS_PASSWORD, the value is the password of redis"
  exit 1
fi
