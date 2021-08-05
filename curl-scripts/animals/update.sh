#!/bin/bash

API="http://localhost:4741"
URL_PATH="/animals"

curl "${API}${URL_PATH}/${ID}" \
  --include \
  --request PATCH \
  --header "Content-Type: application/json" \
--header "Authorization: Bearer ${TOKEN}" \
--data '{
    "animal": {
      "age": "'"${AGE}"'",
      "SIZE": "'"${SIZE}"'"
    }
  }'

echo
