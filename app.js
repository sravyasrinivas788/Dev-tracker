const express = require('express');
require('dotenv').config();
const connectDB = require('./config/db');
const authroute = require('./routes/authroute');
const proroute = require('./routes/proroute');
const helproute=require('./routes/helproute')

const app = express();
connectDB();
app.use(express.json());

app.get('/ping', (req, res) => {
  res.json({ message: "pong" });
});

app.use('/auth', authroute);
app.use('/pro', proroute);
app.use('/help',helproute)

module.exports = app; 
