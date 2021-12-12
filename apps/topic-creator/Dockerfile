from node:latest

COPY . .

ENV KAFKA_BOOTSTRAP_SERVER="cluster-kafka-bootstrap:9092"
ENV TOPIC="test1"
ENV GROUP_ID="group-id"

CMD ["node", "server.js"]