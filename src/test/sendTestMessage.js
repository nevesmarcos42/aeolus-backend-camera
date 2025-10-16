import { Kafka } from 'kafkajs';
import 'dotenv/config';

const kafka = new Kafka({
  clientId: 'aeolus-test-producer',
  brokers: [process.env.KAFKA_BROKER || 'kafka:9092'],
});

const producer = kafka.producer();

const run = async () => {
  await producer.connect();

  const message = {
    cameraID: 'cameraTest',
    eventId: 'evt12345',
    timestamp: Date.now(),
    imageBase64: Buffer.from('Teste de imagem').toString('base64'),
  };

  await producer.send({
    topic: 'device-events',
    messages: [{ value: JSON.stringify(message) }],
  });

  console.log('Mensagem de teste enviada para Kafka');
  await producer.disconnect();
};

run().catch(e => {
  console.error('Erro no produtor:', e);
  process.exit(1);
});
