#!/bin/bash

API="http://localhost:4741"
URL_PATH="/animals"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
    "animal": {
      "name": "'"${NAME}"'",
      "title": "'"${TYPE}"'",
      "text": "'"${AGE}"'",
      "title": "'"${SIZE}"'",
      "text": "'"${FOODTYPE}"'"
    }
  }'

echo
