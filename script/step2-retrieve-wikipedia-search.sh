export SEARCH_VALUE=$(cat 'work/exchange-image-1-searchvalue.txt')
curl http://localhost:3000/wiki/search/$SEARCH_VALUE > work/exchange-image-2-data.json
