import express from "express";
import formidable from "express-formidable";

const router = express.Router();

import { addProduct , updateProductDetails , removeProduct , fetchProducts , fetchProductById , fetchAllProducts , addProductReview , fetchTopProducts , fetchNewProducts} from "../controllers/productController.js";

import { authenticate, isAdmin } from "../middlewares/authMiddleware.js";

import checkId from "../middlewares/checkId.js";

router.route("/").get(fetchProducts).post(authenticate, isAdmin, formidable(), addProduct);

router.route("/allproducts").get(fetchAllProducts);

router.route("/:id/reviews").post(authenticate, isAdmin, checkId, addProductReview);

router.get("/top", fetchTopProducts)
router.get("/new", fetchNewProducts)

router.route("/:id").get(fetchProductById).put(authenticate, isAdmin, formidable(), updateProductDetails).delete(authenticate, isAdmin, removeProduct);


export default router;