import express from 'express';
import {
    getAllFavorites,
    addFavorite,
    removeFavorite,
} from '../controllers/favoriteController.js';

const router = express.Router();

router.route('/').get(getAllFavorites).post(addFavorite);
router.route('/:id').delete(removeFavorite);

export default router;
