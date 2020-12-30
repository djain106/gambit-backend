import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../schemas/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import verifyToken from '../middleware/verifyToken.js';

// Enable .env
dotenv.config();

// Constants
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const TOKEN_EXPIRY = 3600;

// Create router.
var router = express.Router();

// Authenticate user login to application.
router.post('/login',
    body('username').isAlphanumeric().isLength({ min: 5 }),
    body('password').isAlphanumeric().isLength({ min: 8 }),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(errors)
        }

        const username = req.body.username;
        const password = req.body.password;

        const currentUser = await User.findOne({
            username: username
        });

        if (!currentUser) {
            return next("Email or password is incorrect.")
        }

        const compPass = await bcrypt.compare(password, currentUser.password);

        if (!compPass) {
            return next("Email or password is incorrect.")
        }

        const token = jwt.sign({ id: currentUser._id }
            , PRIVATE_KEY
            , { expiresIn: TOKEN_EXPIRY });
        currentUser.password = '';
        res.status(200).json({
            token,
            user: {
                username: currentUser.username,
                balance: currentUser.balance,
            }
        });

        next();
    });

// Authenticate user registration to application.
router.post('/register',
    body('username').isAlphanumeric().isLength({ min: 5 }),
    body('password').isAlphanumeric().isLength({ min: 8 }),
    async (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const user = req.body;
        const currentUser = await User.findOne({ username: user.username });

        if (currentUser) {
            return next("Username is already taken.")
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const newUser = new User({
            username: user.username,
            password: hashedPassword,
        })

        try {
            const savedUser = await newUser.save();
            savedUser.password = undefined;
            const token = jwt.sign({ id: savedUser._id }, process.env.PRIVATE_KEY, {
                expiresIn: TOKEN_EXPIRY,
            });

            console.log(`Registerd new user ${newUser.username}`);
            res.json({
                token,
                user: savedUser.toJSON(),
            });
        } catch (err) {
            console.log(err);
            return next("Error saving user.")
        }
    });


router.get('/user', verifyToken,
    async (req, res, next) => {
        const id_ = req.auth.id;
        try {
            const currentUser = await User.findById(id_);
            res.json({
                username: currentUser.username,
                balance: currentUser.balance,
            })
        } catch (err) {
            return next(err);
        }

    });
export default router