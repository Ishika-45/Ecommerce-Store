import asyncHandler from "../middlewares/asyncHandler";
import User from "../models/userModel";
const createUser = asyncHandler(async (req, res) => {
    res.send("hello");
});

export default createUser;