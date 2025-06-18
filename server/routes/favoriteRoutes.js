import express from 'express';
import {
    getAllFavorites,
    addFavorite,
    removeFavorite,
} from '../controllers/favoriteController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect)
router.route('/').get(getAllFavorites).post(addFavorite);
router.route('/:id').delete(removeFavorite);

export default router;
