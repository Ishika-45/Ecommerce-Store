import express from "express";
import { createUser, loginUser, logoutCurrentUser, getAllUsers, getCurrentUserProfile, updateCurrentUserProfile, deleteUserById, getUserById, updateUserById } from "../controllers/userController.js";
import { isAdmin, authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route('/').post(createUser).get(authenticate, isAdmin, getAllUsers);
router.post('/auth',loginUser);
router.post('/logout', logoutCurrentUser);
router.route('/profile').get(authenticate, getCurrentUserProfile).put(authenticate, updateCurrentUserProfile); 

router.route('/:id').delete(authenticate, isAdmin, deleteUserById).get(authenticate, isAdmin, getUserById).put(authenticate, isAdmin, updateUserById);


export default router;