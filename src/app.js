// src/app.js
const express = require('express');
const { connectMongoDB } = require('./config');
const cameraRoutes = require('./routes/cameras');
require('dotenv').config();

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

startServer();
