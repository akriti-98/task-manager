'use strict'

//in-memory data
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3001;
let data = require('./sample-data').tasks;
app.use(bodyParser.json());


app.get('/tasks', async(req, res) => {
    res.json(data);
})

app.get('/tasks/:id', async(req, res) => {
    let id = req.params.id
    let result = data.find(data1 => data1.id === id);
    if(!result){
        res.status(404).json({ error: 'Task not found' })
    }
    res.json(result);
})

app.post('/tasks', (req, res) => {
    let taskList = req.body;
    res.status(200).json(taskList);
})

app.put('/tasks/:id', (req, res) => {
    let id = req.params.id;
    let editTask = req.body;
    data = data.map(eachData => eachData.id === id ? editTask : eachData);
    res.status(201).json({ message: 'Task updated successfully' });
})

app.delete('/tasks/:id', (req, res) => {
    let id = req.params.id;
    data = data.filter(eachData => eachData.id!== id );
    res.json({ msg: `Task ${id} deleted`})
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});