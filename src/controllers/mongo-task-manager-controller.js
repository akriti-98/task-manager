'use strict'

const Task = require('../model');
const randomString = require('randomstring')

const fetchTaskFromMongo = async function (req, res, next) {
    try {
        const {completed, sortBy} = req.query;
        let query = {};
        if (completed) {
            query.completed = (completed.toLowerCase() === 'true');
        }

        let sortQuery = {};
        if (sortBy === 'createdAt') {
            sortQuery.createdAt = 1;
        }
        const tasks = await Task.find(query).sort(sortQuery);
        return res.status(200).json(tasks);
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}
const fetchTaskByIdFromMongo = async function (req, res, next) {
    try {
        const id = req.params.id;
        const tasks = await Task.findOne({taskId: id});
        if (!tasks) {
            res.status(404).json({error: 'Task not found'})
        } else {
            return res.status(200).json(tasks);
        }
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}
const fetchTaskByPriorityFromMongo = async function (req, res, next) {
    try {
        const {level} = req.params;
        const tasks = await Task.find({priority: level});
        return res.status(200).json(tasks);
    } catch (error) {
        console.error('Error fetching tasks by priority:', error);
        return res.status(500).json({error: 'Error fetching tasks by priority'});
    }
}

const createTaskFromMongo = async function (req, res, next) {
    try {
        const taskId= randomString.generate({ length: 6, charset: 'alphanumeric' })
        const {title, description, completed, priority} = req.body;
        let task = new Task({taskId,title, description, completed, priority})
        let savedTask = await task.save();
        return res.status(200).json(savedTask);
    } catch (err) {
        return res.status(500).json({error: 'Error adding task'});
    }
}

const updateTaskFromMongo = async function (req, res, next) {
    try {
        const taskId = req.params.id;

        const updatedTask = await Task.findOneAndUpdate({taskId: taskId}, req.body);
        if (updatedTask) {
            return res.status(200).json({error: 'Task Updated successfully'});
        }
        return res.status(404).json({error: 'No Task found'});

    } catch (error) {
        console.error('Error updating task:', error);
        return res.status(500).json({error: 'Error updating task'});
    }
}

const deleteTaskFromMongo = async function (req, res, next) {
    try {
        const taskId = req.params.id;
        const deletedTask = await Task.findOneAndDelete({taskId: taskId});
        if (!deletedTask) {
            return res.status(404).json({error: 'Task not found'});
        }
        return res.json({message: 'Task deleted successfully'});
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({error: 'Error deleting task'});
    }
}

module.exports = {
    fetchTaskFromMongo: fetchTaskFromMongo,
    fetchTaskByIdFromMongo: fetchTaskByIdFromMongo,
    fetchTaskByPriorityFromMongo: fetchTaskByPriorityFromMongo,
    createTaskFromMongo: createTaskFromMongo,
    updateTaskFromMongo: updateTaskFromMongo,
    deleteTaskFromMongo: deleteTaskFromMongo
}