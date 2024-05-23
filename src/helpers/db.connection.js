'use strict'

const mongoose = require('mongoose');
const mysql = require('mysql2/promise');
const redis = require('redis');

//mongo connection
const connectMongoDB = async function () {
    try {
        await mongoose.connect('mongodb://localhost:27017/tasks', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

//mysql connection
const connectMySQL = async () => {
    try {
        const pool = await mysql.createPool({
            connectionLimit: 10,
            host: 'localhost',
            "user": "root",
            "password": "",
            database: 'mydatabase'
        })
        console.log('Connected to MySQL');
        return pool;
    } catch (err) {
        console.error('Error connecting to MySQL:', err);
    }
}

//redis
const connectRedis = async function () {
    try {
        const redisClient = redis.createClient({
            url: 'redis://localhost:6379' // Default URL for local Redis server
        });

        await redisClient.connect()
        // Perform Redis operations here
        console.log('Redis client connected');
        redisClient.on('error', (error) => {
            console.error('Redis client error:', error);
        });
        return redisClient;
    } catch (error) {
        console.error('Error connecting to Redis:', error);
    }
}

module.exports = {connectMongoDB, connectMySQL, connectRedis};
