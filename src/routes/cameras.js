// src/routes/cameras.js
const express = require('express');
const router = express.Router();
const Camera = require('../models/Camera');
const { cameraSchema } = require('../utils/validators');
const axios = require('axios');

/**
 * Cria uma nova câmera no MongoDB e registra no serviço gerador
 */
router.post('/', async (req, res) => {
  try {
    await cameraSchema.validateAsync(req.body);
    const camera = new Camera(req.body);
    await camera.save();

    // Comunicação com o serviço gerador via HTTP
    await axios.post(process.env.URL_SERVICO_GERADOR + '/api/devices', camera);

    res.status(201).json(camera);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * Lista todas as câmeras cadastradas
 */
router.get('/', async (req, res) => {
  try {
    const cameras = await Camera.find();
    res.json(cameras);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Retorna câmera por ID
 */
router.get('/:id', async (req, res) => {
  try {
    const camera = await Camera.findById(req.params.id);
    if (!camera) {
      return res.status(404).json({ error: 'Câmera não encontrada' });
    }
    res.json(camera);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Atualiza câmera pelo ID e sincroniza com serviço gerador
 */
router.put('/:id', async (req, res) => {
  try {
    await cameraSchema.validateAsync(req.body);
    const camera = await Camera.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!camera) {
      return res.status(404).json({ error: 'Câmera não encontrada' });
    }

    await axios.put(process.env.URL_SERVICO_GERADOR + `/api/devices/${camera.cameraID}`, camera);

    res.json(camera);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * Remove câmera pelo ID e do serviço gerador
 */
router.delete('/:id', async (req, res) => {
  try {
    const camera = await Camera.findByIdAndDelete(req.params.id);
    if (!camera) {
      return res.status(404).json({ error: 'Câmera não encontrada' });
    }

    await axios.delete(process.env.URL_SERVICO_GERADOR + `/api/devices/${camera.cameraID}`);

    res.json({ message: 'Câmera removida com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
