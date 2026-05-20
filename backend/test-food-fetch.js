import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import foodModel from './models/foodModel.js';
import connectWithFallback from './dbConnect.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

async function testFoodFetch() {
    try {
        await connectWithFallback();
        console.log('✓ Connected to MongoDB');

        const foods = await foodModel.find({}).lean();
        console.log(`\n✓ Found ${foods.length} foods:\n`);
        console.log(JSON.stringify(foods, null, 2));

        await mongoose.disconnect();
        console.log('\n✓ Test complete');
        process.exit(0);
    } catch (error) {
        console.error('✗ Error:', error.message);
        process.exit(1);
    }
}

testFoodFetch();
