'use strict'
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3001;
const router= require("./router");
const { connectMongoDB, connectMySQL, connectRedis} =require('./helpers/db.connection')
app.use(bodyParser.json());


connectMongoDB();

const poolPromise = connectMySQL();

const redisPromise = connectRedis();

app.use(async (req, res, next) => {
    req.pool = await poolPromise;
    req.redisClient = await redisPromise;
    next();
});

// app.use(async (req, res, next) => {
//
//     next();
// });

app.use('/tasks', router);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;