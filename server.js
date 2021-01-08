import express from 'express';
import mongoose from 'mongoose';
import Cors from 'cors';
import dotenv from 'dotenv';
import authenticationRouter from './routers/authentication.js'
import balanceRouter from './routers/balance.js'
import cookieParser from 'cookie-parser'
import errorHandler from './middleware/errorHandler.js'

// App Config
dotenv.config();
const app = express();
const port = process.env.PORT || "8001";
const password = process.env.PASSWORD;
const connection_url = `mongodb+srv://admin:${password}@databasecluster.runk9.mongodb.net/usersdb?retryWrites=true&w=majority`;

// Middlewares
app.use(Cors());
app.use(express.json());
app.use(cookieParser());
app.use('/auth', authenticationRouter);
app.use('/balance', balanceRouter);
app.use(errorHandler);

// DB Config
mongoose.connect(connection_url,
    {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    },
    () => console.log("Connected to MongoDB Database."));

// API Endpoints
app.get('/', (req, res) => res.status(200).send('Connection verified.'));

// Listener
app.listen(port, () => console.log(`listening on localhost: ${port}`))
