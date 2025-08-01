import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Successfully connected")
    }
    catch (error) {
        console.error(`ERROR: ${error.message}`)
        process.exit(1)
    }
}