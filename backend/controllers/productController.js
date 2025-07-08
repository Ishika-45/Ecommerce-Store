import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";

const addProduct = asyncHandler(async (req, res) => {
    try {
        const { name, price, description, category, quantity, brand } = req.fields;

        switch (true) {
            case !name:
                return res.status(400).json({ message: "Name is required" });
            case !price:
                return res.status(400).json({ message: "Price is required" });
            case !description:
                return res.status(400).json({ message: "Description is required" });
            case !category:
                return res.status(400).json({ message: "Category is required" });
            case !quantity:
                return res.status(400).json({ message: "Quantity is required" });
            case !brand:
                return res.status(400).json({ message: "Brand is required" });
        }


        const product = new Product({ ...req.fields });

        const savedProduct = await product.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

const updateProductDetails = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, description, category, quantity, brand } = req.fields;

        switch (true) {
            case !name:
                return res.status(400).json({ message: "Name is required" });
            case !price:
                return res.status(400).json({ message: "Price is required" });
            case !description:
                return res.status(400).json({ message: "Description is required" });
            case !category:
                return res.status(400).json({ message: "Category is required" });
            case !quantity:
                return res.status(400).json({ message: "Quantity is required" });
            case !brand:
                return res.status(400).json({ message: "Brand is required" });
        }
        if (!id) {
            return res.status(400).json({ message: "Product ID is required" });
        }
        const product = await Product.findByIdAndUpdate(id, { ...req.fields }, { new: true });
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const updatedProduct = await product.save();
        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

const removeProduct = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Product ID is required" });
        }
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

const fetchProducts = asyncHandler(async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

const fetchProductById = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Product ID is required" });
        }
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

const fetchAllProducts = asyncHandler(async (req, res) => {
    try {
        const products = await Product.find({}).populate("category").limit(12).sort({ createdAt: -1 });
        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

const addProductReview = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, comment } = req.body;

        if (!id) {
            return res.status(400).json({ message: "Product ID is required" });
        }

        if (!rating || !comment) {
            return res.status(400).json({ message: "Rating and comment are required" });
        }

        const product = await Product.findById(id);

        if (product) {
            const alreadyReviewed = product.reviews.find(
                (r) => r.user.toString() === req.user._id.toString()
            );

            if (alreadyReviewed) {
                return res.status(400).json({ message: "Product already reviewed" });
            }

            const review = {
                user: req.user._id,
                name: req.user.username,
                rating: Number(rating),
                comment,
            };

            product.reviews.push(review);
            product.numReviews = product.reviews.length;
            product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;
        } else {
            return res.status(404).json({ message: "Product not found" });
        }

        await product.save();
        res.status(201).json({ message: "Review added successfully" });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "Server error", error: error.message });
    }
});

const fetchTopProducts = asyncHandler(async (req, res) => {
    try {
        const products = await Product.find({}).sort({ ratings: -1 }).limit(5);
        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

const fetchNewProducts = asyncHandler(async (req,res) => {
    try {
        const products = await Product.find().sort({ _id: -1 }).limit(5);
        res.status(200).json(products);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
})

export { addProduct, updateProductDetails, removeProduct, fetchProducts, fetchProductById, fetchAllProducts, addProductReview , fetchTopProducts , fetchNewProducts};