const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    taskId: {type: String, unique: true },
    title: String,
    description: String,
    completed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' }
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;