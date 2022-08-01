//import mongoose to make schemas for the database
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//todo schema for todo posts collection
const TodoSchema = Schema({
    text: {
        type: String,
        required: true
    },
    complete: {
        type: Boolean,
        default: false
    },
    timestamp: {
        type: String,
        default: Date.now()
    }
});

//create a new collection called Todo with the TodoSchema
const Todo = mongoose.model("Todo", TodoSchema);


//export this so I can use this schema in my server file
module.exports = Todo;