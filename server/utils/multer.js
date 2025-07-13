import multer from "multer";
import path from "path";
import fs from "fs";

// Helper to ensure folder exists
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const model = req.params.model || "other"; // fallback if not provided
    const folder = `uploads/${model}`;
    ensureDir(folder); // make sure the folder exists
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = Date.now() + "-" + file.originalname.replace(/\s/g, "_");
    cb(null, name);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/jpg"];
  cb(null, allowed.includes(file.mimetype));
};

export const upload = multer({ storage, fileFilter });
