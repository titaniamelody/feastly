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

async function removeDescription() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB Atlas");

        const result = await foodModel.updateMany(
            {},
            { $unset: { description: 1 } }
        );

        console.log(`Removed description field from ${result.modifiedCount} food items`);

        // Verify the update
        const foods = await foodModel.find({}).lean();
        console.log("\nAll foods after update:");
        foods.forEach(f => {
            console.log(`- ${f.name} | Category: ${f.category} | Price: ${f.price}`);
        });

        await mongoose.disconnect();
        console.log("\nDisconnected from MongoDB");
    } catch (error) {
        console.error("Error:", error);
    }
}

removeDescription();
