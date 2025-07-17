import express from "express";
import path from "path";
import multer from "multer";
import fs from "fs";

const router = express.Router();

// Ensure uploads folder exists
const __dirname = path.resolve();
const uploadPath = path.join(__dirname, "/uploads");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname);
    const filename = `${file.fieldname}-${Date.now()}${extname}`;
    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif|webp/;
  const mimetype = file.mimetype;
  const extname = path.extname(file.originalname).toLowerCase();

  if (filetypes.test(extname) && mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only images are allowed."), false);
  }
};

const upload = multer({ storage, fileFilter });
const uploadSingleImage = upload.single("image");

router.post("/", (req, res) => {
  uploadSingleImage(req, res, (err) => {
    if (err) {
      return res
        .status(400)
        .send({ message: "Error uploading image", error: err.message });
    }

    if (!req.file) {
      return res.status(400).send({ message: "No file uploaded" });
    }

    res.status(200).send({
      message: "Image uploaded successfully",
      image: `/uploads/${req.file.filename}`,
    });
  });
});

export default router;
