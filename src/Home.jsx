import React, { useEffect, useState } from 'react';
import { fetchTasks, addTask, fetchTimeStamps, addTimeStamp, addTag, fetchTags } from "./api";
import './home.css';

const HomePage = () => {
  const [tasks, setTasks] = useState([]);
  const [timeStamps, setTimeStamps] = useState([]);
  const [tags, setTags] = useState([]);
  const [activeTask, setActiveTask] = useState(null);
  const [activeTaskTime, setActiveTaskTime] = useState(0);
  const [backLogTasks, setBackLogTasks] = useState([]);
  const [unactiveTasks, setUnactiveTasks] = useState([]);
  const [readyTasks, setReadyTasks] = useState([]);
  const [optionBox, setOptionBox] = useState(false);
  const [openTask, setOpenTask] = useState(null);
  const [TaskForm, setTaskForm] = useState({});
  const [taskStatus, setTaskStatus] = useState(null);

  const handleTaskFormChange = (e) => {
    setTaskForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const createForm = () => {
    return (
      <form>
        <input
          type="text"
          name="name"
          placeholder="Task name"
          value={TaskForm.name || ""}
          onChange={handleTaskFormChange}
        />
        <input
          type="text"
          name="additionalData"
          placeholder="Additional data"
          value={TaskForm.additionalData || ""}
          onChange={handleTaskFormChange}
        />
        <button type="submit" onClick={handleAddTask}>Add Task</button>
      </form>
    );
  };

  const refreshTasksAndTags = async () => {
    const allTasks = await fetchTasks();
    const allTags = await fetchTags();
    setTasks(allTasks);
    setTags(allTags);
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    console.log('Adding task');
    const { name, additionalData } = TaskForm;
    if (!name) {
      return alert('Invalid name');
    }
    console.log(await addTask(name, null, additionalData));
    refreshTasksAndTags();
  };

  const handleTaskClick = (task) => {
    console.log(task)
    console.log('Task clicked:', task.name);
    if(openTask === null) {
      setOpenTask(task);
      setOptionBox(true);
      checkTaskStatus(task.id);
    }
    else {
      setOpenTask(null);
      setOptionBox(false);
      return;
    }
  };

  const closeOptionBox = () => {
    console.log('Closing option box');
    setOpenTask(null);
    setOptionBox(false);
  
  };

  const openOptionBox = () => {
    let funcToCall = unactivateTask;
    let activeText = 'Unactivate';
    if(taskStatus === 0) {
      activeText = 'Activate';
      funcToCall = activateTask;
    }
    
    return (
      <div id="optionContainer">
        <h1 contentEditable onBlur={(e) => onTaskInfoChange(e.target.textContent, "name")}>{openTask.name}</h1>
        <p contentEditable onBlur={(e) => onTaskInfoChange(e.target.textContent, "additional")}>{openTask.additional_data}</p>
        <div>Tags
          <ul>
            [{openTask.tags}]
          </ul>
        </div>
        <p>Status: {taskStatus}</p>
        <button onClick={funcToCall}>{activeText}</button>
        <button onClick={markAsReady}>Mark as ready</button>
        <button>Edit</button>
        <button onClick={closeOptionBox}>Close and save</button>
      </div>
    );
  };

  const onTaskInfoChange = (newInfo, whatToChange) => {
    console.log('Changing task info:', newInfo);
    if(whatToChange === "name") {
      setOpenTask((prev) => ({...prev, name: newInfo}));
    }
    else if(whatToChange === "additional") {
      setOpenTask((prev) => ({...prev, additional_data: newInfo}));
    }
  }
  

  const unactivateTask = async () => {
    if(openTask === null ) {
      console.log('No task is selected, you should not be able to call this function');
      return;
    }
    console.log('Unactivating task:', openTask.name);
    const currentTime = new Date().toISOString().replace('T', ' ').replace('Z', '');
    await addTimeStamp(currentTime, openTask.id, 0);
    setTaskStatus(0);
  }

  const activateTask = async () => {
    if(openTask.id === null ) {
      console.log('No task is selected, you should not be able to call this function');
      return;
    }
    console.log('Activating task:', openTask.id);
    const currentTime = new Date().toISOString().replace('T', ' ').replace('Z', '');
    await addTimeStamp(currentTime, openTask.id, 1);
    setTaskStatus(1);
    
  }

  const markAsReady = async () => {
    if(openTask === null ) {
      console.log('No task is selected, you should not be able to call this function');
      return;
    }
    console.log('Marking task as ready:', openTask.id);
    if(taskStatus === 1) {
      const currentTime = new Date().toISOString().replace('T', ' ').replace('Z', '');
      await addTimeStamp(currentTime, openTask.id, 0);
      setTaskStatus(0);
    } 
    const taskToAdd = tasks.find((task) => task.id === openTask.id);
    console.log('Task to add to ready:', taskToAdd);
    setReadyTasks((prev) => [...prev, taskToAdd]);

  }

  const checkTaskStatus = async (taskId) => {
    const taskTimeStamps = await fetchTimeStamps();
    const task = taskTimeStamps.filter((ts) => ts.task === taskId);
    console.log("Task:", task);
    setTaskStatus(task.length ? task[task.length - 1].type : null);
  };

  const getNonActivatedTasks = async () => {
    const timeStamps = await fetchTimeStamps();
    const activatedTasks = new Set();
    timeStamps.forEach((ts) => {
      if (ts.type === 0) {
        activatedTasks.add(ts.task);
      }
    });
    console.log("Activated tasks:", activatedTasks);
  };

  useEffect(() => {
    console.log('HomePage is active');
    document.body.style.backgroundColor = 'lightblue';
    document.body.style.color = 'black';

    return () => {
      console.log('HomePage is unmounted');
      document.body.style.backgroundColor = ''; // Cleanup
      document.body.style.color = ''; // Cleanup
    };
  }, []);

  return (
    <div id="HomeContainer">
      <div id="mainContainer">
        <div>BACKLOG
          <ul className="taskState">
            {tasks.map((task) => (
              <li
                onClick={() => optionBox ? '' : handleTaskClick(task)}
                key={task.id}
              >
                {task.name}. Tags: {task.tags}. info: {task.additional_data}
              </li>
            ))}
          </ul>
        </div>
        <div>UNACTIVE</div>
        <div>ACTIVE</div>
        <div>READY
          <ul className="taskState">
            {readyTasks.map((task) => (
              <li
                onClick={() => optionBox ? '' : handleTaskClick(task)}
                key={task.id}
              >
                {task.name}. Tags: {task.tags}. info: {task.additional_data}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div id="TempContainer">
        <div id="taskButton">
          <button onClick={refreshTasksAndTags}>Get tasks</button>
        </div>
        <div>{createForm()}</div>
      </div>
      {optionBox ? openOptionBox() : ''}
    </div>
  );
};

export default HomePage;


//TODO LIST for the home page

// DONE 1. Make the active/unactivate button work (change the status of the task)
// DONE 2. Make the Mark as ready button work (change the status of the task to ready and move it to the ready list)
// 3. Make the Edit button work (Make the form's fields editable and add a save button) // Forget save button save changes when user closes the option box
// 5. Make adding tags to the task possible
// 6. Make it possible to make new tags
// 7. Make it possible to delete tags
// 8. Make it possible to filter tasks by tags
// 9. Add a timeline that shows active tasks and the time they have been active (The timeline can be customized by the user)
// 10. Add a timer that shows the time spent on the active task
// 11. Add a timer that shows the time spent on the ready tasks

// Settings tab TODO LIST
// 

