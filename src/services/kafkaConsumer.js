import Kafka from'kafkajs';
import createClient from'@clickhouse/client';
import AWS from 'aws-sdk'; // import { S3Client } from '@aws-sdk/client-s3';
import 'dotenv/config';

const kafka = new Kafka({
  clientId: 'aeolus-backend',
  brokers: [process.env.KAFKA_BROKER || 'kafka:9092'],
  retry: {
    initialRetryTime: 300,
    retries: 10,
    factor: 0.2,
    multiplier: 2,
    maxRetryTime: 30000,
  },
  consumer: {
    restartOnFailure: async (error) => {
      console.error('restartOnFailure chamado devido ao erro:', error);
      // Reinicia o consumidor se for erro recuperável
      if (error.retriable) {
        return true;
      }
      // Não reinicia para outros erros
      return false;
    }
  }
});

const consumer = kafka.consumer({ groupId: 'aeolus-group' });

// Configurações de ClickHouse
const clickhouse = createClient({ url: process.env.CLICKHOUSE_HOST });

// Configurações MinIO
const s3 = new AWS.S3({
  endpoint: new AWS.Endpoint(process.env.MINIO_ENDPOINT),
  accessKeyId: process.env.MINIO_ACCESS_KEY,
  secretAccessKey: process.env.MINIO_SECRET_KEY,
  s3ForcePathStyle: true,
});

async function uploadImage(eventId, base64Image) {
  const bufferImg = Buffer.from(base64Image, 'base64');
  const s3Key = `${eventId}.jpg`;
  await s3.upload({
    Bucket: 'eventos',
    Key: s3Key,
    Body: bufferImg,
    ContentType: 'image/jpeg',
  }).promise();
  return s3Key;
}

async function processMessage(value) {
  let evento;
  try {
    evento = JSON.parse(value);
  } catch (error) {
    console.error('Erro ao fazer parse do evento:', error, 'Valor:', value);
    return;
  }

  if (!evento.cameraID || !evento.eventId || !evento.timestamp) {
    console.warn('Evento inválido, campos faltando:', evento);
    return;
  }

  try {
    if (evento.imageBase64) {
      evento.imageUrl = await uploadImage(evento.eventId, evento.imageBase64);
      delete evento.imageBase64;
    }

    await clickhouse.insert({
      table: 'eventos_movimento',
      values: [evento],
      format: 'JSONEachRow',
    });

    console.log(`Evento ${evento.eventId} processado e inserido no ClickHouse.`);
  } catch (error) {
    console.error('Erro no processamento do evento:', error);
  }
}

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const startConsumer = async () => {
  for (;;) { // Loop infinito para tentar conectar sempre
    try {
      await consumer.connect();
      console.log('Consumidor Kafka conectado');

      await consumer.subscribe({ topic: 'device-events', fromBeginning: true });
      console.log('Recebido no tópico device-events');

      await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          const value = message.value.toString();
          console.log(`Mensagem recebida: ${topic}: ${value}`);

          await processMessage(value);
        },
      });

      break; // Sai do loop se a execução foi bem sucedida

    } catch (error) {
      console.error('Erro no consumidor Kafka:', error);
      console.log('Tentando reconectar em 5 segundos...');
      await delay(5000);
    }
  }
};

module.exports = { startConsumer };
