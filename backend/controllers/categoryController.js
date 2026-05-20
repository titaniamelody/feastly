import categoryModel from "../models/categoryModel.js";

const addCategory = async (req, res) => {
    const { name, description } = req.body;
    let imageFilename = "";

    if (req.file) {
        imageFilename = req.file.filename;
    }

    try {
        const category = new categoryModel({
            name,
            description,
            image: imageFilename
        });
        await category.save();
        res.json({ success: true, message: "Category added" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

const listCategories = async (req, res) => {
    try {
        const categories = await categoryModel.find({}).lean();
        res.json({ success: true, data: categories });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

const deleteCategory = async (req, res) => {
    try {
        await categoryModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Category deleted" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

export { addCategory, listCategories, deleteCategory };