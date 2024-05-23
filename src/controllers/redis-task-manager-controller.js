'use strict'

const Task = require('../model');
const randomString = require('randomstring')

const fetchTaskFromRedis = async function (req, res, next) {
    try {
        const redisClient = req.redisClient;
        let tasks = [];
        let taskKey = await redisClient.keys('tasks:*');
        if (taskKey.length > 0) {
            for (let key of taskKey) {
                let task = await redisClient.get(key);
                if (task) {
                    tasks.push(JSON.parse(task));
                }
            }
            return res.json(tasks);
        }
        const fetchTasks = await Task.find();
        for (let task of fetchTasks) {
            redisClient.set(`tasks:${task.taskId}`, JSON.stringify(task), {EX: 3600});
        }
        return res.json(fetchTasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({error: 'Error fetching tasks'});
    }
}
const fetchTaskByIdFromRedis = async function (req, res, next) {
    try {
        const redisClient = req.redisClient;
        let id = req.params.id;
        const cachedTasks = await redisClient.get(`tasks:${id}`);
        if (cachedTasks) {
            console.log('Data retrieved from Redis cache', cachedTasks);
            return res.json(JSON.parse(cachedTasks));
        }
        const task = await Task.findOne({taskId: id});
        if (task) {
            redisClient.set(`tasks:${task.taskId}`, JSON.stringify(task), {EX: 3600});
            return res.json(task);
        } else {
            res.status(404).json({error: 'No task found'});
        }
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({error: 'Error fetching tasks'});
    }
}
const fetchTaskByPriorityFromRedis = async function (req, res, next) {
    try {
        const redisClient = req.redisClient;
        const {level} = req.params;
        const tasks = await Task.find({priority: level});
        return res.status(200).json(tasks);
    } catch (error) {
        console.error('Error fetching tasks by priority:', error);
        return res.status(500).json({error: 'Error fetching tasks by priority'});
    }
}

const createTaskInRedisAndMongoDB = async function (req, res, next) {
    try {
        const data = req.body;
        data.taskId = randomString.generate({length: 6, charset: 'alphanumeric'})
        const redisClient = req.redisClient;
        const createdTasks = await Task.create(data);
        if (createdTasks.length > 0) {
            for (let task of createdTasks) {
                redisClient.set(`tasks:${task.taskId}:${task.priority}`, JSON.stringify(task), {EX: 3600});
            }
        }
        return res.status(200).json(createdTasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({error: 'Error fetching tasks'});
    }
}

const updateTaskInRedisAndMongoDB = async function (req, res, next) {
    try {
        const redisClient = req.redisClient;
        let id = req.params.id;
        const updatedTask = await Task.findOneAndUpdate({taskId: id}, req.body, {new: true, upsert: true});
        redisClient.set(`tasks:${updatedTask.taskId}`, JSON.stringify(updatedTask), {EX: 3600});
        return res.status(200).json(updatedTask);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({error: 'Error fetching tasks'});
    }
}

const deleteTaskInRedisAndMongoDB = async function (req, res, next) {
    try {
        const redisClient = req.redisClient;
        let id = req.params.id;
        const DeletedTask = await Task.findOneAndDelete({taskId: id});
        if (DeletedTask) {
            redisClient.del(`tasks:${DeletedTask.taskId}`);
            return res.status(200).json({msg: 'Deleted Task successfully'});
        }
        return res.status(404).json({msg: 'Task not found'});
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({error: 'Error fetching tasks'});
    }
}

module.exports = {
    fetchTaskFromRedis: fetchTaskFromRedis,
    fetchTaskByIdFromRedis: fetchTaskByIdFromRedis,
    fetchTaskByPriorityFromRedis: fetchTaskByPriorityFromRedis,
    createTaskInRedisAndMongoDB: createTaskInRedisAndMongoDB,
    updateTaskInRedisAndMongoDB: updateTaskInRedisAndMongoDB,
    deleteTaskInRedisAndMongoDB: deleteTaskInRedisAndMongoDB
}