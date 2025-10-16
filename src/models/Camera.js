import mongoose from'mongoose';

const CameraSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
    trim: true
  },
  cameraID: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  zona: {
    type: String,
    required: true,
    trim: true
  },
  enderecoRTSP: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true // Cria createdAt e updatedAt automaticamente
});

module.exports = mongoose.model('Camera', CameraSchema);
