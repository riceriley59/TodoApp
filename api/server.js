//import modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');

//initialize express object
const app = express();

//middlewares
app.use(express.json());
app.use(cors());

//connect to database
mongoose.connect(
    process.env.DB_connection, 
    {useNewUrlParser: true, useUnifiedTopology: true},
).then(()=> console.log('Connected to DB')).catch(console.error);

//import collection that we are going to change
const Todo = require('./models/Todo');

//route to get todo list
app.get('/todos', async(req, res)=>{
    try{
        const todos = await Todo.find();
        res.json(todos);
    }catch(err){
        res.json({message: err});
    }
});

//route to create new todo item
app.post('/todo/new', async(req, res)=>{
    const todo = new Todo({
        text: req.body.text
    });

    try{
        const savedTodo = await todo.save();
        res.json(savedTodo);
    }catch(err){
        res.json({message: err});
    }
});

//route to delete todo item
app.delete('/todo/delete/:id', async(req, res)=>{
    try{
        const result = await Todo.findByIdAndDelete(req.params.id);
        res.json(result);
    }catch(err){
        res.json({message: err});
    }
});


//route to change complete attribute status for the todo application
app.get('/todo/complete/:id', async(req, res)=>{   
    try{
        const todo = await Todo.findById(req.params.id);
        todo.complete = !todo.complete;

        const savedTodo = await todo.save();
        res.json(savedTodo);
    }catch(err){
        res.json({message: err});
    }
});


//open express app on the port 3000
app.listen(3000, ()=>{
    console.log("Server is running on port 3000");
});