#! /bin/bash
if [ -z "$UDEV_MONGO_PASSWORD" ]; then
  echo "Need to set Environment Variable: UDEV_MONGO_PASSWORD, the value is your MongoDB Password"
  exit 1
fi
