const Joi = require('joi');


// Validação dos dados da câmera para garantir formato correto
const cameraSchema = Joi.object({
    nome: Joi.string().required(),
    cameraID: Joi.string().required(),
    zona: Joi.string().required(),
    enderecoRTSP: Joi.string().uri().required()
});

module.exports = { cameraSchema };