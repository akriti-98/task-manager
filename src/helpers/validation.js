'use strict';

exports.validateTask = (req, res, next) => {
    const { title, description, priority } = req.body;
    if (!title) {
        return res.status(400).json({ error: 'Title is required' });
    }
    if (!description) {
        return res.status(400).json({ error: 'Description is required' });
    }
    if (priority && !['low', 'medium', 'high'].includes(priority)) {
        return res.status(400).json({ error: 'Invalid priority level' });
    }
    next();
};