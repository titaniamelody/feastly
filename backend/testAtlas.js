import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

console.log('Testing MongoDB Atlas connection...');
console.log('MONGO_URI:', process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
})
.then(() => {
    console.log('✓ Connected to MongoDB Atlas successfully!');
    return mongoose.connection.db.listCollections().toArray();
})
.then(collections => {
    console.log('Collections:', collections.map(c => c.name));
    return mongoose.connection.close();
})
.catch(err => {
    console.error('✗ Connection failed:', err.message);
    process.exit(1);
});