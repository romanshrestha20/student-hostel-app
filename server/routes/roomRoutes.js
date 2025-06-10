import express from "express";
import {
  createRoom,
  getAllRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
} from "../controllers/roomController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").get(getAllRooms).post( createRoom);
router
  .route("/:id")
  .get(getRoomById)
  .put( updateRoom)
  .delete( deleteRoom);

export default router;
//         return res.status(400).json({ error: "All fields are required" })
