import React, { useEffect, useState } from 'react';

// Task imports
import { fetchTasks, addTask, fetchTasksWtag } from "./api";



const HomePage = () => {
  const [tasks, setTasks] = useState([]);
  const [fooTasks, setTasksWtag] = useState([]);
  const {TaskForm, setTaskForm} = useState({id: 0, name: '', additionalData: ''});

  const handleTaskFormChange = (e) => {
    setTaskForm({ ...TaskForm, [e.target.name]: e.target.value });
  };
  const createForm = () => {
    return (
      <form>
        <input type="number" name="id" placeholder='Task id' onChange={handleTaskFormChange} />
        <input type="text" name="name" placeholder="Task name" onChange={handleTaskFormChange} />
        <input type="text" name="additionalData" placeholder="Additional data" onChange={handleTaskFormChange} />
        <button type="submit" onClick={handleAddTask}>Add Task</button>
      </form>
    );
  }


  const refreshTasks = async () => {
    const allTasks = await fetchTasks();
    setTasks(allTasks);
  };

  const handleAddTask = async () => {
    const {id, name, data} = TaskForm;
    // Check if the id is valid
    const ids = tasks.map((task) => task.id);
    const maxId = Math.max(...ids);
    if (id <= maxId) {
      return alert('Invalid id');
    }
    if(!name) {
      return alert('Invalid name');
    }
    await addTask(id, name, data);
    refreshTasks();
  };
  const handleClick = () => {
    return alert('Hello there');
  }


  useEffect(() => {
    console.log('HomePage is active');
    document.body.style.backgroundColor = 'lightblue';
    document.body.style.color = 'black';
    refreshTasks();

    return () => {
      console.log('HomePage is unmounted');
      document.body.style.backgroundColor = ''; // Cleanup
    };
  }, []);



  return <div id="HomeContainer">
    <h1>Home Page</h1>
    <button onClick={handleClick}>Click me!</button>
    <h2>Tasks</h2>
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>{task.name}. Tags: {task.tags}</li>
      ))}
    </ul>
    {createForm()}
  </div>

};

export default HomePage;