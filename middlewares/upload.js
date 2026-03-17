import multer from "multer";
import path from "path";

// Set up storage engine for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Directory to save uploaded files
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName); // Save file with unique name
  },
});

// File filter to allow only images
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jped" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true); // Accept file
  } else {
    cd(new Error("Only images are allowed"), false); // Reject file
  }
};

// Create multer instance
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 }, //limit file size to 5MB
});

export default upload;
