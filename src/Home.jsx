import React, { useEffect, useState } from 'react';

// Task imports
import { fetchTasks, addTask, fetchTasksWtag } from "./api";
import TaskList from "./TaskComponents/TaskList";
import AddTask from "./TaskComponents/AddTask";
import GetTaskWtag from "./TaskComponents/GetTaskWtag";


const HomePage = () => {
  const [tasks, setTasks] = useState([]);
  const [fooTasks, setTasksWtag] = useState([]);

  const refreshTasks = async () => {
    const allTasks = await fetchTasks();
    setTasks(allTasks);
  };

  const handleAddTask = async (name, additionalData) => {
    await addTask(name, additionalData);
    refreshTasks();
  };
  
  useEffect(() => {
    console.log('HomePage is active');
  }, []);
  
  const handleClick = () => {
    return alert('Hello there');
  }
  
  
  useEffect(() => {
    console.log('HomePage is active');
    document.body.style.backgroundColor = 'lightblue';

    return () => {
      console.log('HomePage is unmounted');
      document.body.style.backgroundColor = ''; // Cleanup
    };
  }, []);

  

  return <div id="HomeContainer">
    <h1>Home Page</h1>
    <button onClick={handleClick}>Click me!</button>
    
  </div> 

};

export default HomePage;