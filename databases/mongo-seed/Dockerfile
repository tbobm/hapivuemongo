FROM mongo:3.6.7-jessie

COPY data.csv /tmp/data.csv
CMD mongoimport --host mongodb --db hapivue --collection crimes --drop --type csv --headerline --file /tmp/data.csv
