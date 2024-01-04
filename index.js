const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const connectionurl = process.env.MONGO_URL;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const {loggedIn} = require('./middleware/auth');

const categoryRouter = require('./routes/category');
const customerRouter = require('./routes/customer');
const creditCustomerRouter = require('./routes/creditcustomer');
const supplierRouter = require('./routes/supplier');
const supplierOrderRouter = require('./routes/supplierorder');
const supplierOrderDetailRouter = require('./routes/supporderdetail');
const supplierTransactionRouter = require('./routes/supptransactions');
const customerOrderRouter = require('./routes/customerorder');
const customerOrderDetailRouter = require('./routes/custorderdetail');
const customerTransactionRouter = require('./routes/custtransaction');
const employeeRouter = require('./routes/employee');
const productRouter = require('./routes/products');
const authRouter = require('./routes/auth');


const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/auth', authRouter);
app.use('/products', loggedIn, productRouter);
app.use('/category', loggedIn, categoryRouter);
app.use('/customer', loggedIn, customerRouter);
app.use('/creditcustomer', loggedIn, creditCustomerRouter);
app.use('/supplier', loggedIn, supplierRouter);
app.use('/supplierorder', loggedIn, supplierOrderRouter);
app.use('/supplierorderdetail', loggedIn, supplierOrderDetailRouter);
app.use('/suppliertransaction', loggedIn, supplierTransactionRouter);
app.use('/customerorder', loggedIn, customerOrderRouter);
app.use('/customerorderdetail', loggedIn, customerOrderDetailRouter);
app.use('/customertransaction', loggedIn, customerTransactionRouter);
app.use('/employee', loggedIn, employeeRouter);
app.set('path', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'views')));
app.set('view engine', 'html');

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: app.get('path') });
}
);

app.get('*', (req, res) => {
    res.redirect('/');
}
);

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