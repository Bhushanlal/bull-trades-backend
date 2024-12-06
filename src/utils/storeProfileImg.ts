import * as multer from "multer";
import * as fs from "fs";

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "public/images";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true }); // Create directory if it doesn't exist
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Filter for allowed file types
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true); // Accept image files
  } else {
    cb(new Error("Invalid file type. Only images are allowed."), false);
  }
};

// Create the multer instance
const uploadService = multer({
  storage,
  fileFilter,
});

export default uploadService;
