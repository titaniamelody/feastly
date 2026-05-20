import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const connectWithFallback = async () => {
    const mongoUri = process.env.MONGO_URI;
    
    console.log("Attempting to connect to MongoDB...");
    
    // Try SRV URL first
    try {
        console.log("Trying SRV connection...");
        await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 10000,
            connectTimeoutMS: 10000,
            socketTimeoutMS: 15000,
            tls: true,
            retryWrites: true,
        });
        console.log("✓ Connected successfully via SRV!");
        return;
    } catch (error) {
        console.log("✗ SRV connection failed:", error.message);
    }
    
    // Try direct connection as fallback
    try {
        console.log("Trying direct connection to primary shard...");
        const directUri = "mongodb://Titania:Melody123@cluster0-shard-00-02.losjdia.mongodb.net:27017/?directConnection=true&authSource=admin&replicaSet=atlas-xxqzg8-shard-0&tls=true";
        await mongoose.connect(directUri, {
            serverSelectionTimeoutMS: 30000,
            connectTimeoutMS: 10000,
            socketTimeoutMS: 15000,
            retryWrites: true,
        });
        console.log("✓ Connected successfully via direct connection!");
        return;
    } catch (error) {
        console.log("✗ Direct connection failed:", error.message);
    }
    
    // Try localhost as last resort
    try {
        console.log("Trying local MongoDB fallback...");
        await mongoose.connect("mongodb://127.0.0.1:27017/fooddelivery", {
            serverSelectionTimeoutMS: 5000,
        });
        console.log("✓ Connected to local MongoDB!");
        return;
    } catch (error) {
        console.error("✗ All connection methods failed!");
        throw error;
    }
};

export default connectWithFallback;
