import React, { useEffect, useState } from 'react';
import { fetchTasks, addTask, fetchTimeStamps, addTimeStamp, addTag, fetchTags, PatchTask, PutTask } from "./TaskComponents/api";
import './home.css';
import Timeline from './TaskComponents/timeline';
import Select from 'react-select';
import openOptionBox from './TaskComponents/taskOptions';

const HomePage = (props) => {
  const { alternativeMode } = props;
  const [tasks, setTasks] = useState([]);
  const [timeStamps, setTimeStamps] = useState([]);
  const [tags, setTags] = useState([]);
  const [optionBox, setOptionBox] = useState(false);
  const [openTask, setOpenTask] = useState(null);
  const [TaskForm, setTaskForm] = useState({});
  const [taskStatus, setTaskStatus] = useState(null);
  const [timeRangeTaskPairs, setTimeRangeTaskPairs] = useState([]);
  const [uiTasks, setUiTasks] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  const [taskColors, setTaskColors] = useState(new Map());


  const handleTaskFormChange = (e) => {
    setTaskForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const createForm = (whichForm) => {
    if(whichForm === 'tag') {
      return (
        <form>
          <input
            type="text"
            name="tagName"
            placeholder="Tag name"
            value={TaskForm.tagName || ""}
            onChange={handleTaskFormChange}
          />
          <button type="submit" onClick={handleAddTag}>Add Tag</button>
        </form>
      );
    } else {
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
            name="tags"
            placeholder="Tags, Example 1,2,3"  
            value={TaskForm.tags || ""}
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
    }
  };

  const [taskPriorities, setTaskPriorities] = useState(() => {
    const storedPriorities = localStorage.getItem("taskPriorities");
    return storedPriorities ? JSON.parse(storedPriorities) : {}; // Return empty object if no data found
  });

  // Function to fetch all tasks, tags and timestamps and update the state
  // This function is used to refresh the data and save it to the state
  const refreshAndSave = async () => {
    const allTasks = await fetchTasks();
    const allTags = await fetchTags();
    const allTimeStamps = await fetchTimeStamps();
    setTimeStamps(allTimeStamps);
    setTags(allTags);
    setUiTasks([...allTasks].map((task) => ({
      ...task,
      priority: taskPriorities[task.id] || "NO-PRIORITY", // Assign the priority or "No Priority" if not found
    })));

    // Make a map for background colors for tasks based on their active status from timestamp table
    setTaskColors(new Map(allTasks.map((task) => {
      const taskTimeStamps = allTimeStamps.filter((ts) => ts.task === task.id);
      if(taskTimeStamps.length === 0) {
        return [task.id, 'lightcoral'];
      }
      const taskStatus = taskTimeStamps[taskTimeStamps.length - 1].type;
      return [task.id, taskStatus === 1 ? 'lightgreen' : 'lightcoral'];
    })));

    setTasks(allTasks);
  };

  // Function to handle the addition of a tag
  // The function will check if the name is valid
  const handleAddTag = async (e) => {
    e.preventDefault();
    const { tagName } = TaskForm;
    if (!tagName) {
      return alert('Invalid name');
    }
    refreshAndSave();
  };

  // Function to handle the addition of a task
  // The function will check if the name is valid and if the tags are valid
  const handleAddTask = async (e) => {
    e.preventDefault();
    const { name, tags, additionalData } = TaskForm;
    if (!name) {
      return alert('Invalid name');
    }
    if(tags) {
      // Check if tags are valid by checking if they only contain numbers and can be split by commas
      const regex = /^\d+(,\d+)*$/;
      if(!regex.test(tags)) {
        alert('Invalid tags');
        return;
      }
      const tagIds = tags.split(',');
      for (const tag of tagIds) {
        if(tags.includes(tag) === false) {
          alert('Invalid tag: ' + tag);
          return;
        }
      }
    }
    await addTask(name, tags, additionalData);
    refreshAndSave();
  };

  // Function to handle the click of a task
  // If the task is clicked, the option box will open
  const handleTaskClick = (task) => {
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

  const onTaskInfoChange = (newInfo, whatToChange) => {
    
    if(whatToChange === "name") {
      setOpenTask((prev) => ({...prev, name: newInfo}));
    }
    else if(whatToChange === "additional") {
      setOpenTask((prev) => ({...prev, additional_data: newInfo}));
    }
    else if(whatToChange === "tags") {
      //Check if the new tags are valid
      const newInfoArray = newInfo.split(',');
      // Check for duplicates
      if(newInfoArray.length !== new Set(newInfoArray).size) {
        alert('Duplicate tags found');
        // Set the tags back to the original
        const oldTags = tasks.find((task) => task.id === openTask.id).tags.split(',');

        setOpenTask((prev) => ({ ...prev, tags: oldTags.join(',') }));
        return;
      }
      // parse the new tags to integers/numbers
      newInfoArray.forEach((tag, index) => {
        newInfoArray[index] = parseInt(tag);
      });

      const tagIds = tags.map((tag) => tag.id);

      for (const tag of newInfoArray) {
        if(tagIds.includes(tag) === false) {
          alert('Invalid tag: ' + tag);
          // Set the tags back to the original
          const oldTags = tasks.find((task) => task.id === openTask.id).tags.split(',');

          setOpenTask((prev) => ({ ...prev, tags: oldTags.join(',') }));
        }
      }
      // If all tags are valid, continue with updating openTask
      setOpenTask((prev) => ({ ...prev, tags: newInfo }));
    }
  }

  const checkTaskStatus = async (taskId) => {
    const taskTimeStamps = await fetchTimeStamps();
    const task = taskTimeStamps.filter((ts) => ts.task === taskId);
    setTaskStatus(task.length ? task[task.length - 1].type : null);
  };

  useEffect( () => {
    refreshAndSave();
  }, []);


  const [draggingTask, setDraggingTask] = useState(null);

  const handleDragStart = (task) => {
    setDraggingTask(task);
  };

  const handleDrop = (e, newPriority) => {
    e.preventDefault();

    if (!draggingTask) return;

    // Update the task's priority
    const updatedTasks = uiTasks.map((task) =>
      task.id === draggingTask.id ? { ...task, priority: newPriority } : task
    );

    setUiTasks(updatedTasks);
    // Save the updated priority to the taskPriorities object and replace the old
    const updatedPriorities = { ...taskPriorities, [draggingTask.id]: newPriority };
    setTaskPriorities(updatedPriorities);

    // Save updated priorities to localStorage
    localStorage.setItem("taskPriorities", JSON.stringify(updatedPriorities));
    
    setDraggingTask(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Allow dropping
  };

  return (    
    <div id="HomeContainer">
      <div id='tagFilter'>
        <Select 
          isMulti 
          options={tags.map((tag) => ({value: tag.id, label: tag.name}))} 
          placeholder="Filter by tags"
          onChange={(selected) => {setSelectedTags(selected)}}
          />
      </div>
      <div id="mainContainer">
        {["NO-PRIORITY", "LOW-PRIORITY", "MEDIUM-PRIORITY", "HIGH-PRIORITY"].map((priority) => (
          <div
            key={priority}
            onDrop={(e) => handleDrop(e, priority)}
            onDragOver={handleDragOver}
            style={{
              padding: "10px",
              margin: "10px",
              minHeight: "100px",
            }}
          >
            <h3>{priority}</h3>
            <ul className="taskState">
              {/* If the filter option is on then filter the tasks by the selected filters */}
              {selectedTags.length > 0 ? uiTasks.filter((task) => {
                let found = false;
                selectedTags.forEach((tag) => {
                  if(task.tags.includes(tag.value)) {
                    found = true;
                  }
                });
                return found; 
              })
              .filter((task) => task.priority === priority)
              .map((task) => {
                return (
                  <li
                    key={task.id}
                    draggable
                    onDragStart={() => handleDragStart(task)}
                    onClick={(e) => {
                      // Prevent onClick from firing if the task is being dragged
                      if (e.target === e.currentTarget) {
                        handleTaskClick(task);
                      }
                    }}
                    style={{
                      padding: "5px",
                      margin: "5px",
                      cursor: "grab",
                      backgroundColor: taskColors.get(task.id),
                    }}>
                    {task.name + " "}
                    Tags: {tags.map((tag) => task.tags.includes(tag.id) ? tag.name + ", " : '').join('')}
                    Info: {task.additional_data}
                  </li>
                );
              })
              : uiTasks
                .filter((task) => task.priority === priority)
                .map((task) => (
                  <li
                    key={task.id}
                    draggable
                    onDragStart={() => handleDragStart(task)}
                    onClick={(e) => {
                      // Prevent onClick from firing if the task is being dragged
                      if (e.target === e.currentTarget) {
                        handleTaskClick(task);
                      }
                    }}
                    style={{
                      padding: "5px",
                      margin: "5px",
                      backgroundColor: taskColors.get(task.id),
                      cursor: "grab",
                    }}>
                    {task.name + " "}
                    Tags: {tags.map((tag) => task.tags.includes(tag.id) ? tag.name + ", " : '').join('')}
                    Info: {task.additional_data}
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
      <div id="TempContainer">
        <div>{createForm('task')}</div>
        <div>{createForm('tag')}</div>
        <div>
          {Timeline(tasks, tags, timeStamps, setTimeStamps, refreshAndSave, timeRangeTaskPairs, setTimeRangeTaskPairs)}
        </div>
      </div>
      {optionBox ? openOptionBox(openTask, setOpenTask, tags, onTaskInfoChange, taskStatus, setTaskStatus, refreshAndSave, setOptionBox, alternativeMode) : ''}
    </div>
  );
};

export default HomePage;
