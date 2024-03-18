#!/bin/bash

# Function to check Kafka Connect health
check_connect_health() {
    # Use curl to check the status of Kafka Connect
    status=$(curl -sS -o /dev/null -w '%{http_code}' http://localhost:8083/connectors)
    
    # If status code is 200, Kafka Connect is healthy
    if [ $status -eq 200 ]; then
        echo "Kafka Connect is healthy"
        return 0
    else
        echo "Kafka Connect is not healthy, status code: $status"
        return 1
    fi
}

# Loop until Kafka Connect is healthy
while ! check_connect_health; do
    echo "Waiting for Kafka Connect to be healthy..."
    sleep 5  # Adjust sleep duration as needed
done

echo "Kafka Connect is now healthy"

# RUN MYSQL CONNECTOR CONFIG
MYSQL_CONNECTOR=$(cat /scripts/connectors/mysql.source.json)
curl -X POST \
    http://localhost:8083/connectors \
    -H "Content-Type: application/json" \
    --data $(echo "$MYSQL_CONNECTOR" | jq -c .)

# RUN ELASTICSEARCH CONNECTOR CONFIG
ELASTICSEARCH_CONNECTOR=$(cat /scripts/connectors/elasticsearch.sink.json)
curl -X POST \
    http://localhost:8083/connectors \
    -H "Content-Type: application/json" \
    --data $(echo "$ELASTICSEARCH_CONNECTOR" | jq -c .)