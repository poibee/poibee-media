# Goal
* Load image data with license for an OSM-ID (with Wikidata-ID or Wikipedia title).

# Webservices
* OpenStreetMap (OSM): https://www.openstreetmap.org
* Wikipedia projects: Wikipedia https://wikipedia.org, Wikidata https://www.wikidata.org, Wikimedia https://commons.wikimedia.org 
* Lizenzhinweisgenerator: https://lizenzhinweisgenerator.de

# Used techniques and libraries:
* Node.js: https://nodejs.org
* NestJS: https://nestjs.com
* wikibase-sdk: https://github.com/maxlath/wikibase-sdk
* Cypress: https://www.cypress.io
* MongoDB: https://www.mongodb.com, Mongoose: https://mongoosejs.com

# Approach
* request an image by OSM-ID (with Wikidata-ID or Wikipedia title)
* * return corresponding result, if the OSM-ID is found in the tables (OSM-ID has already been processed)
* * return empty result if OSM-ID isn't found in the tables (first request), but the data is processed and stored afterwards
* store OSM-IDs in a table to cache result and avoid further processing
* * 'image-licenses': image is found and a licence is available
* * 'image-errors': processing caused an error table (e.g. no image, no license)

```nvm use stable```

# Mongo

```docker run -p 27017:27017 --name poibee-mongo -d mongo```

see: 
* https://docs.nestjs.com/techniques/mongodb
* https://github.com/nestjs/nest/tree/master/sample/06-mongoose

# script for wikidata entity: Q1551353
```nvm use stable```
```./script/licence-of-entity.sh Q1551353```

# Development
```nvm use stable```
```npm run start```

# Wikidata: Q1551353

```curl http://localhost:3000/wiki/entity/Q1551353```

# Wiki-Sitelinks: de:Douglas Adams

```curl 'http://localhost:3000/wiki/title-de:Douglas%20Adams'```

## Docker
```docker build -t poibee-media .```
```docker images```
```docker run -p 55555:3000 -d --name poibee-media-app poibee-media```


################

rm -rf work/*
docker build -t poibee-media .
docker run -p 55556:3000 -d  --name poibee-media-app poibee-media
docker logs -f poibee-media-app
docker exec -it poibee-media-app /bin/sh
docker run -it --entrypoint sh poibee-media
docker rm -f poibee-media-app
docker rmi poibee-media  

