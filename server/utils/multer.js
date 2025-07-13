import multer from "multer";
import path from "path";
import fs from "fs";

// Set up storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Assume model name is provided in req.body.model or req.query.model
    const modelName = req.body.model || req.query.model || "default";
    const uploadDir = path.join(__dirname, "../../uploads", modelName);
    // Ensure the upload directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const fileName =
      path.basename(file.originalname, ext) + "-" + uniqueSuffix + ext;
    cb(null, fileName);
  },
});

export default multer({ storage });
