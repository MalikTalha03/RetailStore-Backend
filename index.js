const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const productRouter = require('./routes/products');
require('dotenv').config();
const connectionurl = process.env.MONGO_URL;
const bodyParser = require('body-parser');

const app = express();
app.use(express.json());
app.use(cors());
app.use('/products', productRouter);
app.use(bodyParser.urlencoded({ extended: false }));

mongoose.connect(connectionurl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.log(err);
    });

app.listen(3000, () => {
    console.log('Server started at port 3000');
}
);