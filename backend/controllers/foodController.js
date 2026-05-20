import foodModel from "../models/foodModel.js";
import fs from "fs";

// add food items
const addFood = async (req,res) => {

    let image_filename = `${req.file.filename}`

    // Parse ingredients if it's a JSON string
    let ingredients = [];
    if (req.body.ingredients) {
        if (typeof req.body.ingredients === 'string') {
            try {
                ingredients = JSON.parse(req.body.ingredients);
            } catch (e) {
                ingredients = req.body.ingredients.split(',').map(i => i.trim());
            }
        } else if (Array.isArray(req.body.ingredients)) {
            ingredients = req.body.ingredients;
        }
    }

    const food = new foodModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        image: image_filename,
        category: req.body.category,
        ingredients: ingredients,
        prepTime: req.body.prepTime || "",
        servings: req.body.servings || "",
        method: req.body.method || ""
    })

    try {
        await food.save()
        res.json({success: true, message: "Food item added successfully!"})
    } catch (error) {
        console.log(error)
        res.json({success: false, message: "Error"})
    }

}

// add food list
const listFood = async (req,res) => {
    try{
        const foods = await foodModel.find({}).lean()
        res.json({success:true, data:foods})
    } catch (error) {
        console.log(error)
        res.json({success:true, message:"Error"})
    }
}

// remove food item
const removeFood = async (req,res) => {
    try {
        const food = await foodModel.findById(req.body.id)
        fs.unlink(`uploads/${food.image}`, ()=>{})

        await foodModel.findByIdAndDelete(req.body.id)
        res.json({success:true, message:"Food Removed"})
    } catch (error) {
        res.json({success:false, message:"Error"})
    }
}

// update food item
const updateFood = async (req,res) => {
    try {
        const { id, name, price, category, description, prepTime, servings, method } = req.body
        const updateData = { name, price, category, description, prepTime, servings, method }
        
        // Parse ingredients if provided
        if (req.body.ingredients) {
            let ingredients = [];
            if (typeof req.body.ingredients === 'string') {
                try {
                    ingredients = JSON.parse(req.body.ingredients);
                } catch (e) {
                    ingredients = req.body.ingredients.split(',').map(i => i.trim());
                }
            } else if (Array.isArray(req.body.ingredients)) {
                ingredients = req.body.ingredients;
            }
            updateData.ingredients = ingredients;
        }
        
        // If new image is uploaded
        if (req.file) {
            // Get old food to delete old image
            const oldFood = await foodModel.findById(id)
            if (oldFood && oldFood.image) {
                fs.unlink(`uploads/${oldFood.image}`, ()=>{})
            }
            updateData.image = req.file.filename
        }

        await foodModel.findByIdAndUpdate(id, updateData)
        res.json({success:true, message:"Food updated successfully!"})
    } catch (error) {
        console.log(error)
        res.json({success:false, message:"Error"})
    }
}

export { addFood, listFood, removeFood, updateFood}
