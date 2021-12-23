const { Kafka } = require('kafkajs')
const express = require('express')
const bodyParser = require('body-parser');

const app = express()
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const port = 3000

const kafka = new Kafka({
  clientId: process.env.CLIENT_ID,
  brokers: [process.env.KAFKA_BOOTSTRAP_SERVER]
})
const producer = kafka.producer()


const main = async () => {
  await producer.connect()

  app.get('/', async (req, res) => {
    res.send('Hello World!')
  })

  app.post('/', async (req, res) => {

    try {
      const responses = await producer.send({
        topic: process.env.TOPIC,
        messages: [{ key: 'message', value: req.body.message, partition: 0}]
      })
  
      console.log('Published message', { responses })
      res.sendStatus(200);
    } catch (error) {
      console.error('Error publishing message', error)
      res.sendStatus(500);
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
