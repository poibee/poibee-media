#!/usr/bin/env bash
SECONDS=0
rm -f work/*
searchValue='de:Douglas%20Adams'
if [[ -z $1 ]];
then
    echo "No parameter passed. Then we use '$searchValue' !"
else
    searchValue=$1
fi
echo "$searchValue"> 'work/exchange-image-1-searchvalue.txt'
./script/step1-start-wiki-service.sh &
sleep 10
./script/step2-retrieve-wikipedia-title.sh
./script/step3-retrieve-license.sh
./script/step4-stop-wiki-service.sh
duration=$SECONDS
echo "$(($duration / 60)) minutes and $(($duration % 60)) seconds elapsed."
