const { Kafka } = require('kafkajs')

// This creates a client instance that is configured to connect to the Kafka broker provided by
// the environment variable KAFKA_BOOTSTRAP_SERVER
const kafka = new Kafka({
  clientId: 'producer-example-app',
  brokers: [process.env.KAFKA_BOOTSTRAP_SERVER]
})

module.exports = kafka
