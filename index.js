const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const connectionurl = process.env.MONGO_URL;
const bodyParser = require('body-parser');

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


const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/products', productRouter);
app.use('/category', categoryRouter);
app.use('/customer', customerRouter);
app.use('/creditcustomer', creditCustomerRouter);
app.use('/supplier', supplierRouter);
app.use('/supplierorder', supplierOrderRouter);
app.use('/supplierorderdetail', supplierOrderDetailRouter);
app.use('/suppliertransaction', supplierTransactionRouter);
app.use('/customerorder', customerOrderRouter);
app.use('/customerorderdetail', customerOrderDetailRouter);
app.use('/customertransaction', customerTransactionRouter);
app.use('/employee', employeeRouter);
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