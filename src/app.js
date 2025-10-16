import express from 'express';
import connectMongoDB from './config/databaseConnection.js';
import startConsumer from'./services/kafkaConsumer.js';
import cameraRoutes from'./routes/cameras.js';
import 'dotenv/config';

const app = express();

app.use(express.json()); // Para suportar JSON no body

// Rotas para gerenciamento das câmeras
app.use('/cameras', cameraRoutes);

const PORT = process.env.PORT || 3000;

// Inicia conexão com banco e servidor
const startServer = async () => {
  await connectMongoDB();
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
};

startConsumer().catch(e => console.error(`[Kafka Consumer] Erro: ${e.message}`, e));

startServer();
