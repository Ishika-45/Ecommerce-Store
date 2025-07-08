import categoryModel from "../models/categoryModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";

const createCategory = asyncHandler(async (req, res) => {
    try {
        const { name } = req.body;

        if(!name){
            return res.status(400).json({ message: "Category name is required" });
        }

        // Check if category already exists
        const existingCategory = await categoryModel.findOne({ name });
        if (existingCategory) { 
            return res.status(400).json({ error: "Category already exists" });
        }

        const category = await new categoryModel({ name }).save();
        res.json(category);

        if (!category) {
            return res.status(500).json({ message: "Failed to create category" });
        }
        
        console.log(name);
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Server error", error: error.message });
    }
});

const updateCategory = asyncHandler(async (req, res) => {
    try {
        const { categoryId } = req.params;
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Category name is required" });
        }

        const category = await categoryModel.findById({ _id: categoryId});
        if (!category) {
            return res.status(404).json({ error: "Category not found" });
        }
        
        category.name = name;

        const updatedCategory = await category.save();

        res.json(updatedCategory);
    }
    catch(error){
        console.error(error);
        return res.status(500).json({ error: "Internal Server error", error: error.message });
    }
});

const removeCategory = asyncHandler(async (req, res) => {
    try {
        const { categoryId } = req.params;
        if (!categoryId) {
            return res.status(400).json({ error: "Category ID is required" });
        }
        const removed = await categoryModel.findByIdAndDelete(req.params.categoryId);
        if (!removed) {
            return res.status(404).json({ error: "Category not found" });
        }

        res.json({ message: "Category removed successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server error", error: error.message });
    }
});

const listCategory = asyncHandler(async (req, res) => {
    try {
        const categories = await categoryModel.find({});
        res.json(categories);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server error", error: error.message });
    }
});

const readCategory = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const category = await categoryModel.findById(id);
        if (!category) {
            return res.status(404).json({ error: "Category not found" });
        }
        res.json(category);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server error", error: error.message });
    }
});

export { createCategory , updateCategory , removeCategory , listCategory , readCategory };