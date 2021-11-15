const express = require('express');
const app = express();
const dotenv = require("dotenv");
dotenv.config();

const db = require('./config/db')
const route = require('./routes')

const port = process.env.PORT || 3000;

route(app);
db.connect();


app.listen(port, ()=> console.log(`Server running \n Listenning at http://127.0.0.1:${port}`))
