import express from 'express';
import { body, validationResult } from 'express-validator';

var router = express.Router();

// Get user's current balance.
router.get('/current');

// Update user's balance.
router.put('/update');

export default router