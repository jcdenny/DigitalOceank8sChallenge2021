const { Kafka } = require('kafkajs')
const express = require('express')
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express()
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const port = 3000

const kafka = new Kafka({
    clientId: process.env.CLIENT_ID,
    brokers: [process.env.KAFKA_BOOTSTRAP_SERVER]
  })

const consumer = kafka.consumer({
  groupId: process.env.GROUP_ID
})

const main = async () => {
  await consumer.connect()

  await consumer.subscribe({
    topic: process.env.TOPIC,
    fromBeginning: false
  })

  
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log('Received message', {
        key: message.key.toString(),
        value: message.value.toString()
      });

      fs.appendFile('messages', message.value+'\n', err => {
        if (err) {
          console.error(err)
          return
        }
      });
    }
  })

  app.get('/', async (req, res) => {
    fs.readFile("messages", "utf8", function(err, data){
      if(err) throw err;  
      res.send("Messages: "+data);
    });
  })

  app.listen(process.env.PORT || 3000, () => {
    console.log(`Server listening on port ${process.env.PORT || 3000}`)
  })
}

main().catch(async error => {
  console.error(error)
  try {
    await consumer.disconnect()
  } catch (e) {
    console.error('Failed to gracefully disconnect consumer', e)
  }
  process.exit(1)
})
