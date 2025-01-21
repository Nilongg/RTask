import Select from "react-select";
import { PatchTask } from "./api";
import { addTimeStamp, fetchTimeStamps } from "./api";


/**
 * Closes the option box for a task
 * @param {*} setOptionBox 
 * @param {*} openTask 
 * @param {*} setOpenTask 
 * @param {*} refreshAndSave 
 */
const closeOptionBox = async (setOptionBox, openTask, setOpenTask, refreshAndSave) => {
    // Save the new task info to the db
    const { name, additional_data, tags } = openTask;
    await PatchTask(openTask.id, name, tags, additional_data);
    refreshAndSave();
    setOpenTask(null);
    setOptionBox(false);
  };

/**
 * Opens the option box for a task
 * 
 * @param {*} openTask 
 * @param {*} setOpenTask 
 * @param {*} tags 
 * @param {*} onTaskInfoChange 
 * @param {*} taskStatus 
 * @param {*} setTaskStatus 
 * @param {*} refreshAndSave 
 * @param {*} setOptionBox 
 * @param {*} alternativeMode 
 * @returns 
 */
const openOptionBox = (openTask, setOpenTask, tags, onTaskInfoChange, taskStatus, setTaskStatus, refreshAndSave, setOptionBox, alternativeMode) => {
  let activeText = 'Unactivate';
  let taskActive = true;
  
  
  if(taskStatus === 0) {
    taskActive = false;
    activeText = 'Activate';
  }
  // Create a map of tags for easier access
  const tagsMap = new Map(tags.map((tag) => [tag.id, tag.name]));
  
  return (
    <div className="optionContainer">
      <div className='optionItems'>
        {/* Task Name */}
        <h1>
          <input
            id="nameInput"
            type="text"
            defaultValue={openTask.name} // Use `defaultValue` for temporary input editing
            onBlur={(e) => onTaskInfoChange(e.target.value, "name")} // Only update when input loses focus
            placeholder="Task Name"
          />
        </h1>

        {/* Additional Data */}
        <p>
          <textarea
            id="additionalDataInput"
            defaultValue={openTask.additional_data} // Use `defaultValue` for editing
            onBlur={(e) => onTaskInfoChange(e.target.value, "additional")} // Update on blur
            placeholder="Additional Information"
          />
        </p>

        {/* Tags */}
        <div>
          Remove, add and view tags:
          <Select
            isMulti
            options={tags.map((tag) => ({ value: tag.id, label: tag.name }))}
            placeholder="Select tags"
            value={
              openTask.tags
                ? openTask.tags
                  .split(",")
                  .map((tag) => {
                    return tagsMap.has(parseInt(tag))
                      ? { value: tag, label: tagsMap.get(parseInt(tag)) }
                      : null;
                  })
                  .filter(Boolean) // Remove invalid tags
                : []
            }
            onChange={(selected) => {
              const tagIds = selected.map((tag) => tag.value.toString()); // Ensure string type
              setOpenTask((prev) => ({ ...prev, tags: tagIds.join(",") }));
              onTaskInfoChange(tagIds.join(","), "tags");
            }}
          />
        </div>

        {/* Task Status */}
        <p>Status: {taskStatus ? "Activated" : "Unactivated"}</p>

        {/* Action Buttons */}
        <button onClick={taskActive ? () => unactivateTask(openTask, setTaskStatus) 
          : () => activateTask(alternativeMode, openTask, setTaskStatus)}>{activeText}</button>
        <button onClick={
          () => closeOptionBox(setOptionBox, openTask, setOpenTask, refreshAndSave)}>
          Close and save</button>
      </div>
      
    </div>
  );
};


/**
 * Unactivates a task by adding a timestamp of type 0 to the db
 * @param {*} openTask 
 * @param {*} setTaskStatus 
 * @returns 
 */
const unactivateTask = async (openTask, setTaskStatus) => {
  if(openTask === null ) {
    console.log('No task is selected, you should not be able to call this function');
    return;
  }
  const currentTime = new Date().toISOString().replace('T', ' ').replace('Z', '');
  await addTimeStamp(currentTime, openTask.id, 0);
  setTaskStatus(0);
}

/**
 * Activates a task by adding a timestamp of type 1 to the db
 * @param {*} alternativeMode 
 * @param {*} openTask 
 * @param {*} setTaskStatus 
 * @returns 
 */
const activateTask = async (alternativeMode, openTask, setTaskStatus) => {
  if(alternativeMode) {
    // Activate only one task at a time
    // unactivate all other tasks
    const timeStamps = await fetchTimeStamps();
    const activatedTasks = new Set();
    timeStamps.forEach((ts) => {
      if (ts.type === 1) {
        activatedTasks.add(ts.task);
      }
    });
    for(const task of activatedTasks) {
      const currentTime = new Date().toISOString().replace('T', ' ').replace('Z', '');
      await addTimeStamp(currentTime, task, 0);
    }
  }
  
  if(openTask.id === null ) {
    console.log('No task is selected, you should not be able to call this function');
    return;
  }
  const currentTime = new Date().toISOString().replace('T', ' ').replace('Z', '');
  await addTimeStamp(currentTime, openTask.id, 1);
  setTaskStatus(1);
  
}


  export default openOptionBox;