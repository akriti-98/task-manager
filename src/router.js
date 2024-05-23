'use strict'

const mongoController= require('./controllers/mongo-task-manager-controller')
const sqlController= require('./controllers/sql-task-manager-controller')
const redisController= require('./controllers/redis-task-manager-controller')
const taskValidator = require('./helpers/validation');

const express = require('express');
const app = express.Router();

//mongo
app.get('/mongo', mongoController.fetchTaskFromMongo);
app.get('/mongo/:id', mongoController.fetchTaskByIdFromMongo);
app.get('/mongo/priority/:level', mongoController.fetchTaskByPriorityFromMongo);
app.post('/mongo', taskValidator.validateTask, mongoController.createTaskFromMongo);
app.put('/mongo/:id', taskValidator.validateTask, mongoController.updateTaskFromMongo);
app.delete('/mongo/:id', mongoController.deleteTaskFromMongo);

//sql
app.get('/mysql', sqlController.fetchTaskFromMySql);
app.get('/mysql/:id', sqlController.fetchTaskByIdFromMySql);
app.get('/mysql/priority/:level', sqlController.fetchTaskByPriorityFromMySql);
app.post('/mysql', taskValidator.validateTask,sqlController.createTaskFromMySql);
app.put('/mysql/:id', taskValidator.validateTask, sqlController.updateTaskFromMySql);
app.delete('/mysql/:id', sqlController.deleteTaskFromMySql);

//redis
app.get('/redis', redisController.fetchTaskFromRedis);
app.get('/redis/:id', redisController.fetchTaskByIdFromRedis);
app.get('/redis/priority/:level', redisController.fetchTaskByPriorityFromRedis);
app.post('/redis', redisController.createTaskInRedisAndMongoDB);
app.put('/redis/:id', redisController.updateTaskInRedisAndMongoDB);
app.delete('/redis/:id', redisController.deleteTaskInRedisAndMongoDB);

module.exports=app;
