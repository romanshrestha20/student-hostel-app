import express from "express";

import { protect } from "../middlewares/authMiddleware.js";
import {
  createHostel,
  deleteHostel,
  getAllHostels,
  getHostelById,
  updateHostel,
  searchHostels,
} from "../controllers/hostelController.js";

const router = express.Router();

router.route("/").get(getAllHostels).post(createHostel);
router.route("/search").get(searchHostels);
router.route("/:id").get(getHostelById).put(updateHostel).delete(deleteHostel);
export default router;
