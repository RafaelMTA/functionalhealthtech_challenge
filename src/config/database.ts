import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export async function connectDB() {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI não esta definido no arquivo .env');
        }

        await mongoose.connect(process.env.MONGODB_URI).then(() => {
            console.log('Conectado ao MongoDB');
        });
    }
    catch (error) {
        console.error('Erro ao conectar ao MongoDB:', error);
        process.exit(1);
    }
}
