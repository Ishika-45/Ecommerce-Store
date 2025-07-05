import asyncHandler from "../middlewares/asyncHandler.js";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/createToken.js";

export const createUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        throw new Error("Please fill all the details.");
    }

    const userExists = await User.findOne({ email });
    if (userExists) res.status(400).send("User already exists");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ username, email, password: hashedPassword });

    try {
        await newUser.save();
        generateToken(res, newUser._id);

        res.status(201).json({
            _id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            isAdmin: newUser.isAdmin
        })
    }
    catch (error) {
        res.status(400)
        throw new Error("Invalid User data")
    }
}); 

export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);

        if (isPasswordValid) {
            generateToken(res, existingUser._id);

            res.status(200).json({
                _id: existingUser._id,
                username: existingUser.username,
                email: existingUser.email,
                isAdmin: existingUser.isAdmin
            });
            return ;
        }

    }

}); 

export const logoutCurrentUser = asyncHandler(async (req, res) => {
    res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0), 
        // secure: process.env.NODE_ENV !== "development",
        // sameSite: "strict",
        // maxAge: 0, // Set maxAge to 0 to delete the cookie
    });

    res.status(200).json({ message: "User logged out successfully" });
});

export const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select("-password");
    res.status(200).json(users);
});

export const getCurrentUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
        });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

export const updateCurrentUserProfile = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    const user = await User.findById(req.user._id);

    if (user) {
        user.username = username || user.username;
        user.email = email || user.email;

        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        const updatedUser = await user.save();

        res.status(200).json({
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin 
        });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

export const deleteUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        if(user.isAdmin){
            res.status(400);
            throw new Error("Cannot delete admin user");
            return; 
        }
        await user.deleteOne({ _id: user._id });
        res.status(200).json({ message: "User removed successfully" });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

export const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select("-password");

    if (user) {
        res.status(200).json(user);
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

export const updateUserById = asyncHandler(async (req, res) => {
    const { username, email, isAdmin } = req.body;

    const user = await User.findById(req.params.id);

    if (user) {
        user.username = username || user.username;
        user.email = email || user.email;
        user.isAdmin = Boolean(isAdmin);

        const updatedUser = await user.save();

        res.status(200).json({ 
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin
        });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});