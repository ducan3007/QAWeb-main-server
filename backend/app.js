require('dotenv').config()
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const routers = require('./routes/main');
const { isBuffer } = require('util');
const app = express()


const urlDbConnect = process.env.db
console.log(process.env.db);

mongoose.connect(urlDbConnect, { useNewUrlParser: true, useUnifiedTopology: true }, error => {
    if (error) {
        throw error;
    }
    console.log("Mongodb connected!")
})



//Set view engine
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
    // logger
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
//Static file public to client
app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.use(routers);




module.exports = app;