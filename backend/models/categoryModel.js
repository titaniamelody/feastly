import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    image: { type: String, default: "" }
});

const categoryModel = mongoose.models.category || mongoose.model("category", categorySchema);

export default categoryModel;