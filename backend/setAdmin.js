import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import userModel from './models/userModel.js';
import connectWithFallback from './dbConnect.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

async function setAdmin() {
    try {
        await connectWithFallback();
        console.log('Connected to MongoDB');

        const result = await userModel.findOneAndUpdate(
            { email: 'titaniamelody@gmail.com' },
            { isAdmin: true },
            { new: true }
        );

        if (result) {
            console.log(`✓ User ${result.email} is now an admin!`);
        } else {
            console.log('✗ User not found! Creating admin user...');
            const newAdmin = new userModel({
                name: 'Admin',
                email: 'titaniamelody@gmail.com',
                password: 'hashed_password_here',
                isAdmin: true,
                cartData: {}
            });
            await newAdmin.save();
            console.log('✓ Admin user created!');
        }

        await mongoose.disconnect();
        console.log('✓ Disconnected from MongoDB');
        process.exit(0);
    } catch (error) {
        console.error('✗ Error:', error.message);
        process.exit(1);
    }
}

setAdmin();
