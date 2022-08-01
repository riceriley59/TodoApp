//import useStat and useEffect so that I can update the DOM elements when theres a change
import { useState, useEffect} from 'react';

//create a global variable for my API in order to POST and GET from collection 
const API_BASE = "http://localhost:3000";

//main app function
function App() {
  //set three state variables and initialize them and then specify update functions using react hooks
  const [todos, setTodos] = useState([]);
  const [popupActive, setPopupActive] = useState(false);
  const [newTodo, setNewTodo] = useState("");

  //useEffect to update the document title react component
  useEffect(()=>{
    document.title = "Todo App";
  });

  //use the useEffect react hook to call fetch all the todo objects from the database and then store them
  //in an array
  useEffect(()=>{
    GetTodos();
  }, []);

  //function that fetches all the todo objects from the mongo database
  const GetTodos = () => {
    //call my GET api route to get all the data then convert that data to json
    //and then pass that json data to my setTodos and update the state with the array of todo objects
    //if there is an error then catch that and display that in console
    fetch(API_BASE + '/todos')
      .then(response => response.json())
      .then(data => setTodos(data))
      .catch(err => console.error("Error: ", err));
  }

  //asynchronous function that changes the complete attribute in the todo object
  //to the inverse of it's current state it awaits the return of the data and once its recieved
  //it then converts the data in json. Also the url param is used with the _id object to specify specific 
  //todo objects in my collection
  const completeTodo = async id => {
    const data = await fetch(API_BASE + '/todo/complete/' + id)
      .then(res => res.json());

    //checks every todo object in the collection and if that id matches the id of the id we fetched
    //then set todo.complete or the client object to the data.completes object and then return that todo
    setTodos(todos => todos.map(todo => {
      if(todo._id === data._id){
        todo.complete = data.complete;
      }

      return todo;
    }));
  }

  //asynchronous function for deleting todo objects from the collection it pushes at the API with
  //the method being delete which then deletes the todo object with the matching url param for it's id
  const deleteTodo = async id => {
    const data = await fetch(API_BASE + '/todo/delete/' + id, {method: "DELETE"})
      .then(res => res.json());

    //changes the todo array to include all the todos that don't have the data _id so that the id that was 
    //deleted gets updated on the client side also
    setTodos(todos => todos.filter(todo => todo._id !== data._id));
  }

  const addTodo = async() => {
    const data = await fetch(API_BASE + '/todo/new', {
      method: "POST", 
      headers: {
        "Content-Type": "application/json"
      }, 
      body: JSON.stringify({
        text: newTodo
      })
    }).then(res => res.json());

    setTodos([...todos, data]);
    setPopupActive(false);
    setNewTodo("");
  }

  return (
    <div className="App">
      <h1>Welcome</h1>
      <h4>Your Tasks</h4>

      <div className="todos">
        {todos.map((todo) => (
          <div className={ "todo " + (todo.complete ? "is-complete" : "")} 
            key={todo._id} onClick={()=> completeTodo(todo._id)}>
            <div className="checkbox"></div>
            <div className="text">{ todo.text }</div>
            <div className="delete-todo" onClick={() => deleteTodo(todo._id)}>x</div> 
          </div>
        ))}
      </div>

      <div className="addPopup" onClick={()=> setPopupActive(true)}>+</div>

      {popupActive ? (
        <div className='popup'>
          <div className='closePopup' onClick={()=> setPopupActive(false)}>x</div>
          <div className='content'>
            <h3>Add Task</h3>
            <input type="text" className='add-todo-input' onChange={e => setNewTodo(e.target.value)} value={newTodo}/>
            <div className='button' onClick={addTodo}>Create Task</div>
          </div>
        </div>
      ) : ''}

    </div>
  );
}

export default App;
