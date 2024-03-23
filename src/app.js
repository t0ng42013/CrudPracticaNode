const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const {config} = require('dotenv');
config();


const productRoutes = require('./routes/routes.products')
const usersRoutes = require('./routes/routes.users')
const categoryRoutes = require('./routes/routes.category')

const app = express();
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URL, { dbName: process.env.MONGO_DB_NAME });
const db = mongoose.connection;    


app.use('/products', productRoutes);
app.use("/users", usersRoutes);
app.use("/category", categoryRoutes);

const port = process.env.PORT || 3000;
app.listen(port,() => console.log(`servidor ok!`));