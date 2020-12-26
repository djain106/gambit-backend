import express from 'express';
import mongoose from 'mongoose';
import User from './User.js';
import Cors from 'cors';

// App Config
const app = express();
const port = process.env.PORT || "8001";
const password = "P9zDzy8cm6Y8BfOg";
const connection_url = `mongodb+srv://admin:${password}@databasecluster.runk9.mongodb.net/usersdb?retryWrites=true&w=majority`;

// Middlewares
app.use(express.json())
app.use(Cors())

// DB Config
mongoose.connect(connection_url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});

// API Endpoints
app.get('/', (req, res) => res.status(200).send('Hello World!'));

app.post('/users', (req, res) => {
    const user = req.body;

    User.create(user, (err, data) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(201).send(data);
        }
    });
});

app.get('/users', (req, res) => {
    User.find((err, data) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(data);
        }
    });
});

// Listener
app.listen(port, () => console.log(`listening on localhost: ${port}`))
