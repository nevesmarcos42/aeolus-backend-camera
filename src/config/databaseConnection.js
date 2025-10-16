import mongoose from'mongoose';
import 'dotenv/config';

/**
 * Função para conectar no banco MongoDB
 */
const connectMongoDB = async () => {
    try { 
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('Conectado ao MongoDB com sucesso!')
    } catch (error) {
        console.error('Erro na conexão com MongoDD', error);
        process.exit(1)
    }
};

module.exports = { connectMongoDB };