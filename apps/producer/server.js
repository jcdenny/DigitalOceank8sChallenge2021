const { Kafka } = require('kafkajs')
const express = require('express')

const app = express()
const port = 3000

const kafka = new Kafka({
  clientId: process.env.CLIENT_ID,
  brokers: [process.env.KAFKA_BOOTSTRAP_SERVER]
})
const producer = kafka.producer()


const main = async () => {
  await producer.connect()

  app.get('/blah', async (req, res) => {
    res.send('Hello World!')
    try {
        const responses = await producer.send({
          topic: process.env.TOPIC,
          messages: [{ key: 'key1', value: 'hello world', partition: 0}]
        })
    
        console.log('Published message', { responses })
      } catch (error) {
        console.error('Error publishing message', error)
      }
  })
  
  app.listen(process.env.PORT || 3000, () => {
    console.log(`Server listening on port ${process.env.PORT || 3000}`)
  })
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
