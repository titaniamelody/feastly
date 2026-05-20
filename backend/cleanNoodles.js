import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://Titania:Melody123@cluster0.losjdia.mongodb.net/";

const foodSchema = new mongoose.Schema({
    name: String,
    price: Number,
    image: String,
    category: String,
});

const foodModel = mongoose.models.food || mongoose.model("food", foodSchema);

async function cleanNoodles() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB Atlas");

        // Get all noodle items
        const noodles = await foodModel.find({ category: "Noodles" }).lean();
        console.log("Found noodles:", noodles.length);

        // Keep only the first occurrence of each unique name
        const seen = new Set();
        const toDelete = [];
        
        for (const n of noodles) {
            if (seen.has(n.name)) {
                toDelete.push(n._id);
            } else {
                seen.add(n.name);
            }
        }

        if (toDelete.length > 0) {
            await foodModel.deleteMany({ _id: { $in: toDelete } });
            console.log(`Deleted ${toDelete.length} duplicate noodle items`);
        }

        // Show remaining noodles
        const remaining = await foodModel.find({ category: "Noodles" }).lean();
        console.log("\nRemaining Noodles:");
        remaining.forEach(n => console.log(`- ${n.name} | Price: ${n.price}`));

        // Show all foods count
        const all = await foodModel.find({}).lean();
        console.log("\nTotal foods in database:", all.length);

        await mongoose.disconnect();
        console.log("\nDisconnected from MongoDB");
    } catch (error) {
        console.error("Error:", error);
    }
}

cleanNoodles();
