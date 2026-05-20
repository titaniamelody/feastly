import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import categoryModel from "./models/categoryModel.js";
import connectWithFallback from "./dbConnect.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const categories = [
    { name: "Salad", description: "Fresh and healthy salads", image: "category_salad.png" },
    { name: "Rolls", description: "Delicious rolls and wraps", image: "category_rolls.png" },
    { name: "Deserts", description: "Sweet desserts and ice cream", image: "category_deserts.png" },
    { name: "Sandwich", description: "Tasty sandwiches", image: "category_sandwich.png" },
    { name: "Cake", description: "Freshly baked cakes", image: "category_cake.png" },
    { name: "Pure Veg", description: "100% vegetarian dishes", image: "category_pureveg.png" },
    { name: "Pasta", description: "Italian pasta dishes", image: "category_pasta.png" },
    { name: "Noodles", description: "Asian noodle dishes", image: "category_noodles.png" }
];

const addAllCategories = async () => {
    try {
        await connectWithFallback();
        
        await categoryModel.deleteMany({});
        const result = await categoryModel.insertMany(categories);
        
        console.log(`✓ Successfully added ${result.length} categories to database`);
        await mongoose.disconnect();
        console.log("✓ Disconnected from MongoDB");
        process.exit(0);
    } catch (error) {
        console.error("✗ Error:", error.message);
        process.exit(1);
    }
};

addAllCategories();
