import jwt from "jsonwebtoken";
import asyncHandler from "./asyncHandler.js";
import User from "../models/userModel.js";

export const authenticate = asyncHandler(async (req, res, next) => {
    let token;

    // Read JWT from the cookie
    token = req.cookies.jwt;

    if(token) {
        try {

            // Verify the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
 
            req.user = await User.findById(decoded.userId).select("-password");
            next();
        } catch (error) {
            res.status(401).json({ message: "Not authorized, token failed" });
            throw new Error("Not authorized, token failed");
        }
    } else {
        res.status(401).json({ message: "Not authorized, token not found"});
        throw new Error("Not authorized, token not found");
    }
});

// Middleware to check if the user is an admin
export const isAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(401).send("Not authorized as an admin");
    }
}