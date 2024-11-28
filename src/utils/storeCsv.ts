import * as fs from "fs";
import * as multer from "multer";
import { Request } from "express";
// Define storage configuration
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const dir = "./public/uploads"; // Destination directory
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true }); // Create directory if it doesn't exist
    }
    cb(null, dir);
  },
  filename: (_req: Request, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname.split(" ").join("-")}`); // Generate filename with timestamp prefix
  },
});

// Define file filter function
const csvFilter = (_req: Request, file, cb) => {
  if (!file) {
    cb(new Error("Please upload a file to proceed."), false);
  } else if (
    !file.mimetype.includes("csv") &&
    file.mimetype !==
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" &&
    file.mimetype !== "application/vnd.ms-excel"
  ) {
    cb(new Error("Please upload only CSV, or Excel files."), false);
  } else {
    cb(null, true);
  }
};

// Initialize multer middleware
const upload = multer({
  storage: storage,
  fileFilter: csvFilter,
});

export default upload;
