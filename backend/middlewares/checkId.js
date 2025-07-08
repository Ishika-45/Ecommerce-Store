import { isValidObjectId } from "mongoose";

function checkId(req, res, next) {
    if(!isValidObjectId(req.params.id)) {
        return res.status(400).json({ error: "Invalid ID format" });
    }
    next();
}   

export default checkId;