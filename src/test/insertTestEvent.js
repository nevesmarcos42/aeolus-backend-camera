import { createClient } from '@clickhouse/client';

async function main() {
  const client = createClient({
    url: 'http://localhost:8123', // usar 'url' ao invés de 'host'
    username: process.env.CLICKHOUSE_USER ?? 'default', // opcional, ajuste se usar autenticação
    password: process.env.CLICKHOUSE_PASSWORD ?? '',   // opcional, ajuste se usar autenticação
  });

  const event = {
    cameraID: 'cameraTest',
    eventId: 'evt12345',
    timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
    imageUrl: 'http://minio:9000/eventos/evt12345.jpg'
  };

  try {
    await client.insert({
      table: 'eventos_movimento',
      values: [event],
      format: 'JSONEachRow',
    });
    console.log('Evento inserido com sucesso no ClickHouse!');
  } catch (error) {
    console.error('Erro ao inserir evento:', error);
  }
}

main();
