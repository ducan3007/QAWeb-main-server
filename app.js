const morgan = require('morgan');
const helmet = require('helmet');
const mongoose = require('mongoose')
const cors = require('cors');
const compression = require('compression');
const path = require('path');
const http = require('http');
const express = require('express');

const routers = require('./routes/routes');


require('dotenv').config()
const app = express();

const urlDbConnect = process.env.db
mongoose.connect(urlDbConnect, { useNewUrlParser: true, useUnifiedTopology: true }, error => {
    if (error) {
        throw error;
    }
    console.log("Mongodb connected!")
})

app.use(morgan('dev'));
app.use(compression());

app.options('*', cors());
app.use(cors({ origin: 'http://localhost:5000' }));

app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api', routers);

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});