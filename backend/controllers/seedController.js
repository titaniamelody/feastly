import foodModel from "../models/foodModel.js";
import categoryModel from "../models/categoryModel.js";

const seedFoods = async (req, res) => {
    const foods = [
        { name: "Greek salad", image: "food_1.png", price: 12, category: "Salad" },
        { name: "Veg salad", image: "food_2.png", price: 18, category: "Salad" },
        { name: "Clover Salad", image: "food_3.png", price: 16, category: "Salad" },
        { name: "Chicken Salad", image: "food_4.png", price: 24, category: "Salad" },
        { name: "Lasagna Rolls", image: "food_5.png", price: 14, category: "Rolls" },
        { name: "Peri Peri Rolls", image: "food_6.png", price: 12, category: "Rolls" },
        { name: "Chicken Rolls", image: "food_7.png", price: 20, category: "Rolls" },
        { name: "Veg Rolls", image: "food_8.png", price: 15, category: "Rolls" },
        { name: "Ripple Ice Cream", image: "food_9.png", price: 14, category: "Deserts" },
        { name: "Fruit Ice Cream", image: "food_10.png", price: 22, category: "Deserts" },
        { name: "Jar Ice Cream", image: "food_11.png", price: 10, category: "Deserts" },
        { name: "Vanilla Ice Cream", image: "food_12.png", price: 12, category: "Deserts" },
        { name: "Chicken Sandwich", image: "food_13.png", price: 12, category: "Sandwich" },
        { name: "Vegan Sandwich", image: "food_14.png", price: 18, category: "Sandwich" },
        { name: "Grilled Sandwich", image: "food_15.png", price: 16, category: "Sandwich" },
        { name: "Bread Sandwich", image: "food_16.png", price: 24, category: "Sandwich" },
        { name: "Cup Cake", image: "food_17.png", price: 14, category: "Cake" },
        { name: "Vegan Cake", image: "food_18.png", price: 12, category: "Cake" },
        { name: "Butterscotch Cake", image: "food_19.png", price: 20, category: "Cake" },
        { name: "Sliced Cake", image: "food_20.png", price: 15, category: "Cake" },
        { name: "Garlic Mushroom", image: "food_21.png", price: 14, category: "Pure Veg" },
        { name: "Fried Cauliflower", image: "food_22.png", price: 22, category: "Pure Veg" },
        { name: "Mix Veg Pulao", image: "food_23.png", price: 10, category: "Pure Veg" },
        { name: "Rice Zucchini", image: "food_24.png", price: 12, category: "Pure Veg" },
        { name: "Cheese Pasta", image: "food_25.png", price: 12, category: "Pasta" },
        { name: "Tomato Pasta", image: "food_26.png", price: 18, category: "Pasta" },
        { name: "Creamy Pasta", image: "food_27.png", price: 16, category: "Pasta" },
        { name: "Chicken Pasta", image: "food_28.png", price: 24, category: "Pasta" },
        { name: "Butter Noodles", image: "food_29.png", price: 14, category: "Noodles" },
        { name: "Veg Noodles", image: "food_30.png", price: 12, category: "Noodles" },
        { name: "Somen Noodles", image: "food_31.png", price: 20, category: "Noodles" },
        { name: "Cooked Noodles", image: "food_32.png", price: 15, category: "Noodles" }
    ];

    try {
        await foodModel.deleteMany({});
        const result = await foodModel.insertMany(foods);
        res.json({ success: true, message: `Seeded ${result.length} foods` });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error seeding foods" });
    }
};

const seedCategories = async (req, res) => {
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

    try {
        await categoryModel.deleteMany({});
        const result = await categoryModel.insertMany(categories);
        res.json({ success: true, message: `Seeded ${result.length} categories` });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error seeding categories" });
    }
};

export { seedFoods, seedCategories };
