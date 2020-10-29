#!/bin/bash

# Export EXIF JSON

rm -rf exports
mkdir -p exports

npm start

cp -r images exports
echo exports/images/*.jpg | xargs jhead -purejpg
