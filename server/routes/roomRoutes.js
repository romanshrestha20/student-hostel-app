import express from "express";
import {
  createRoom,
  getAllRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
  getRoomsByRoomType,
} from "../controllers/roomController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();


router.route("/").get(getAllRooms).post(createRoom);
// get all rooms by room type
router.route("/type").get(getRoomsByRoomType);

router.route("/:id").get(getRoomById).put(updateRoom).delete(deleteRoom);

export default router;
