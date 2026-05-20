import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String, default: ""},
    price: {type: Number, required: true},
    image: {type: String, required: true},
    category: {type: String, required: true},
    rating: {type: Number, default: 4.5, min: 0, max: 5},
    ingredients: [{type: String}],
    prepTime: {type: String, default: ""},
    servings: {type: String, default: ""},
    method: {type: String, default: ""},
})

const foodModel = mongoose.models.food || mongoose.model("food", foodSchema)

export default foodModel