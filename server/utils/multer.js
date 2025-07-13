import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// ESM-safe __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const modelName = req.params.model || "general";
    const uploadDir = path.join(__dirname, "../uploads", modelName);

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
