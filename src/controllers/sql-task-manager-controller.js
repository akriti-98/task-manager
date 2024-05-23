'use strict'


const fetchTaskFromMySql = async function (req, res, next) {
    try {
        const pool = req.pool;
        const [rows] = await pool.query('SELECT * FROM tasks');
        if (rows && rows.length > 0) {

            return res.json(rows);
        } else {
            return res.json([]); // Send an empty array if no rows are returned
        }
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({error: 'Error fetching tasks'});
    }
}

const fetchTaskByIdFromMySql = async function (req, res, next) {
    try {
        const pool = req.pool;
        const id = req.params.id;
        const [rows] = await pool.query('SELECT * FROM tasks where task_id = ?', [id]);
        if (rows && rows.length > 0) {
            return res.json(rows);
        } else {
            res.json([]); // Send an empty array if no rows are returned
        }
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({error: 'Error fetching tasks'});
    }
}
const fetchTaskByPriorityFromMySql = async function (req, res, next) {
    try {
        const pool = req.pool;
        const { level } = req.params;

        // SQL query to find tasks by priority level
        const query = `SELECT * FROM tasks WHERE priority = ?`;
        const [rows] = await pool.query(query, [level]);
        await res.json(rows);
    } catch (error) {
        console.error('Error fetching tasks by priority:', error);
        res.status(500).json({ error: 'Error fetching tasks by priority' });
    }
}

const createTaskFromMySql = async function (req, res, next) {
    try {
        const pool = req.pool;
        const {title, description} = req.body;

        await pool.query('INSERT INTO tasks (title, description) VALUES (?, ?)', [title, description]);
        res.status(201).json({message: 'Task created successfully'});
    } catch (error) {
        console.error('Error inserting task:', error);
        res.status(500).json({error: 'Error inserting task'});
    }
}

const updateTaskFromMySql = async function (req, res, next) {
    try {
        const pool = req.pool;
        const taskId = req.params.id;
        const {title, description} = req.body;
        const [result] = await pool.query('UPDATE tasks SET title = ?, description = ? WHERE task_id = ?', [title, description, taskId]);
        if (result.affectedRows > 0) {
            res.status(201).json({message: 'Task updated successfully'});
        } else {
            res.status(404).json({error: 'Task not found'});
        }
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({error: 'Error updating task'});
    }
}

const deleteTaskFromMySql = async function (req, res, next) {
    try {
        const pool = req.pool;
        const taskId = req.params.id;
        const [result] = await pool.query('DELETE from tasks where task_id = ?', [taskId]);
        if (result.affectedRows > 0) {
            res.status(201).json({message: 'Task deleted successfully'});
        } else {
            res.status(404).json({error: 'Task not found'});
        }
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({error: 'Error deleting task'});
    }
}

module.exports = {
    fetchTaskFromMySql: fetchTaskFromMySql,
    fetchTaskByIdFromMySql: fetchTaskByIdFromMySql,
    fetchTaskByPriorityFromMySql: fetchTaskByPriorityFromMySql,
    createTaskFromMySql: createTaskFromMySql,
    updateTaskFromMySql:updateTaskFromMySql,
    deleteTaskFromMySql:deleteTaskFromMySql
}