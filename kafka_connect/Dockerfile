FROM confluentinc/cp-kafka-connect-base:latest

# Install dependencies
USER root
RUN wget -O /usr/local/bin/jq https://github.com/stedolan/jq/releases/download/jq-1.6/jq-linux64
RUN chmod +x /usr/local/bin/jq
RUN jq --version

# Config kafka connect over environment variables
ENV CONNECT_BOOTSTRAP_SERVERS "kafka:9092"
ENV CONNECT_REST_PORT 8083
ENV CONNECT_GROUP_ID kafka-connect
ENV CONNECT_CONFIG_STORAGE_TOPIC _connect-configs
ENV CONNECT_OFFSET_STORAGE_TOPIC _connect-offsets
ENV CONNECT_STATUS_STORAGE_TOPIC _connect-status
ENV CONNECT_KEY_CONVERTER org.apache.kafka.connect.storage.StringConverter
ENV CONNECT_VALUE_CONVERTER org.apache.kafka.connect.json.JsonConverter
ENV CONNECT_INTERNAL_KEY_CONVERTER "org.apache.kafka.connect.json.JsonConverter"
ENV CONNECT_INTERNAL_VALUE_CONVERTER "org.apache.kafka.connect.json.JsonConverter"
ENV CONNECT_REST_ADVERTISED_HOST_NAME "kafka-connect"
ENV CONNECT_CONFIG_STORAGE_REPLICATION_FACTOR "1"
ENV CONNECT_OFFSET_STORAGE_REPLICATION_FACTOR "1"
ENV CONNECT_STATUS_STORAGE_REPLICATION_FACTOR "1"
ENV CONNECT_LOG4J_ROOT_LOGLEVEL "INFO"
ENV CONNECT_LOG4J_APPENDER_STDOUT_LAYOUT_CONVERSIONPATTERN "[%d] %p %X{connector.context}%m (%c:%L)%n"
ENV CONNECT_LOG4J_LOGGERS "org.apache.kafka.connect.runtime.rest=WARN,org.reflections=ERROR"
ENV CONNECT_PLUGIN_PATH /usr/share/java,/usr/share/confluent-hub-components

# Expose it ports
EXPOSE 8083:8083

# Install required connectors
RUN echo "Installing Connector"
RUN confluent-hub install --no-prompt debezium/debezium-connector-mysql:latest
RUN confluent-hub install --no-prompt confluentinc/kafka-connect-elasticsearch:latest

# Copy required files to enable connectors
COPY connectors/ /scripts/connectors
COPY entrypoint.sh /scripts/entrypoint.sh
COPY connectors.sh /scripts/connectors.sh

# Execute entrypoint to enable connectors
ENTRYPOINT [ "/scripts/entrypoint.sh" ]