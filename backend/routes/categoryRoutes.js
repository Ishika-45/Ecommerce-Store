import express from "express";
import {createCategory, updateCategory, removeCategory, listCategory, readCategory} from "../controllers/categoryController.js"; 

const router = express.Router();

import {authenticate, isAdmin} from "../middlewares/authMiddleware.js";

router.route('/').post(authenticate, isAdmin, createCategory);
router.route('/:categoryId').put(authenticate, isAdmin, updateCategory);
router.route('/:categoryId').delete(authenticate, isAdmin, removeCategory);
router.route("/categories").get(listCategory);

router.route("/:id").get(readCategory);

export default router;