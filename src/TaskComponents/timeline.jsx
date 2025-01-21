
import { addTimeStamp } from './api';
import './Timeline.css';

import Select from 'react-select';

import React, { useEffect, useState } from "react";

// Helper function to get the first day of the month
function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

// Helper function to get the number of days in a month
function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

// Helper function to check if a date is in the selected range
function isInRange(date, startDate, endDate) {
  return date >= startDate && date <= endDate;
}

const Calendar = (tasks, timestamps, refreshAll) => {
  // This function controls the timeline of the tasks and wont interfere with the task handler but does change the task status
  // using the api, so the tasks on the task handler will be updated according to the changes done to the database from this function. 
  const formatDateTime = (date, time) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(date.getDate()).padStart(2, "0");
    const hours = time.split(":")[0];
    const minutes = time.split(":")[1];
    const seconds = "00";
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.000`;
  }

  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDateRange, setSelectedRange] = useState({ start: null, end: null });
  const [calendarTimeRange, setTimeRange] = useState({ startTime: "00:00", endTime: "23:59" });
  //List of time ranges (exact dates and times) that have been added to the list which is the time_range_list
  const [time_range_list, setTimeRangeList] = useState(localStorage.getItem("time_range_list") ? JSON.parse(localStorage.getItem("time_range_list")) : []);
  const [activeTab, setActiveTab] = useState("multiTask");
  const [currentSummaryTask, setCurrentSummaryTask] = useState(null);

  const [timePeriods, setTimePeriods] = useState([]);

  useEffect(() => {
    localStorage.setItem("time_range_list", JSON.stringify(time_range_list));
  }, [time_range_list]);


  // Get the current year and month
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Get the first day and number of days in the current month
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);

  // Generate an array of days to be displayed on the calendar
  const daysArray = [];
  // Add empty days for the start of the month
  for (let i = 0; i < firstDay; i++) {
    daysArray.push(null);
  }
  // Add the actual days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    daysArray.push(i);
  }

  // Function to go to the next month
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  // Function to go to the previous month
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };


  // Handle selecting a date range
  const handleSelectDate = (date) => {
    if (!calendarDateRange.start) {
      // Set start date if not yet selected
      setSelectedRange({ start: new Date(currentYear, currentMonth, date), end: null });
    } else {
      // Set end date if start date is already selected
      setSelectedRange((prevRange) => ({
        ...prevRange,
        end: new Date(currentYear, currentMonth, date),
      }));
    }
  };

  // Handle start time change
  const handleStartTimeChange = (e) => {
    setTimeRange((prevState) => ({ ...prevState, startTime: e.target.value }));
  };

  // Handle end time change
  const handleEndTimeChange = (e) => {
    setTimeRange((prevState) => ({ ...prevState, endTime: e.target.value }));
  };

  const onTimerangeAdd = () => {
    refreshAll();
    // Add the selected range to the list of time ranges and save it to the local storage
    const formattedTimeRange = formatDateTime(calendarDateRange.start, calendarTimeRange.startTime) + " - " + formatDateTime(calendarDateRange.end, calendarTimeRange.endTime);
    const saveableTimerange = formattedTimeRange.split(" - ");

    setTimeRangeList((prevState) => [...prevState, { start: saveableTimerange[0], end: saveableTimerange[1] }]);

    // Reset the selected range and time range
    setSelectedRange({ start: null, end: null });
    setTimeRange({ startTime: "00:00", endTime: "23:59" });
  };

  const singleTaskSummary = (task, single = true) => {
    // Calculate the time used on a task based on the timestamps during the time range
    // TODO
    const formatUiDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
      const day = String(date.getDate()).padStart(2, "0");
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const seconds = date.getSeconds().toString().padStart(2, '0');

      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    const intTask = parseInt(task);
    setTimePeriods([]);

    if (calendarDateRange.start === null && calendarDateRange.end === null) {
      alert("Please select a time range");
      return;
    }
    const timestapmp1 = formatDateTime(calendarDateRange.start, calendarTimeRange.startTime);
    const timestapmp2 = formatDateTime(calendarDateRange.end, calendarTimeRange.endTime);
  

    //Get the timestamps between the selected time range
    const timestampsInRange = timestamps.filter((timestamp) => timestamp.task === intTask && timestamp.timestamp >= timestapmp1 && timestamp.timestamp <= timestapmp2);
    // Separate the timestamps to start and end timestamps and delete duplicates
    const startTimestamps = timestampsInRange.filter((timestamp) => timestamp.type === 1);
    const endTimestamps = timestampsInRange.filter((timestamp) => timestamp.type === 0);
    //Delete duplicates
    const uniqueStartTimestamps = [...new Set(startTimestamps.map((timestamp) => timestamp.timestamp))];
    const uniqueEndTimestamps = [...new Set(endTimestamps.map((timestamp) => timestamp.timestamp))];

    // Sort the timestamps 
    uniqueStartTimestamps.sort();
    uniqueEndTimestamps.sort();

    // Calculate the used time on task using the unique timestamps (start and end)
    // Get every start timestamp and end timestamp and calculate the difference between them and add them together
    // to get the total time used on the task
    let timePeriods = [];
    let totalHours = 0;
    for (let i = 0; i < uniqueStartTimestamps.length; i++) {
      const dateStart = new Date(uniqueStartTimestamps[i]);
      const dateEnd = new Date(uniqueEndTimestamps[i]);

      // Could make some function to shorten these lines? (will do for now)
      const uiDateStart = formatUiDate(dateStart);
      const uiDateEnd = formatUiDate(dateEnd);

      const differenceInMilliseconds = dateEnd - dateStart;
      const differenceInHours = differenceInMilliseconds / (1000 * 60 * 60);
      totalHours += differenceInHours;
      timePeriods.push({ start: uiDateStart, end: uiDateEnd, hours: differenceInHours.toFixed(2) });
    }


    if (single) {
      setTimePeriods(timePeriods);
    } else {
      return timePeriods;
    }

  }

  const [summaryWindow, setSummaryWindow] = useState(false);
  const [tagSummaries, setTagSummaries] = useState([]);
  const [taskSummaries, setTaskSummaries] = useState([]);

  const multiTaskTagSummary = (tasks) => {
    if (summaryWindow) {
      return;
    }
    // Initialize summaries
    let tagSummaries = {}; // Object to hold total hours for each tag
    let taskSummaries = []; // Array to hold task summaries
    let taskTags = []; // Array to hold task IDs and their tags

    // Iterate over tasks to populate taskSummaries and calculate tag totals
    for (let index = 0; index < tasks.length; index++) {
      const task = tasks[index];

      // Get the time summaries for the task
      const timeSummaries = singleTaskSummary(task.id, false); // Array of {start, end, hours}

      // Add task summaries
      taskSummaries.push({ [task.id]: timeSummaries });

      // Add task tags
      taskTags.push({ [task.id]: task.tags });

      // Sum up the total hours for the current task
      const totalTaskHours = timeSummaries.reduce(
        (acc, period) => acc + parseFloat(period.hours),
        0
      );
      // Update tag summaries with the current task's hours
      task.tags.split(",").forEach((tag) => {
        if (!tagSummaries[tag]) {
          // Initialize tag if it doesn't exist
          tagSummaries[tag] = 0;
        }
        // Add the total task hours to the tag
        tagSummaries[tag] += totalTaskHours;
      });
    }

    // Convert tag summaries to an array for easier rendering (optional)
    const tagSummaryArray = Object.entries(tagSummaries).map(([tag, totalHours]) => ({
      tag,
      totalHours: totalHours.toFixed(2), // Format hours to 2 decimal places
    }));

    // Set the summaries to the state
    setTagSummaries(tagSummaryArray);
    setTaskSummaries(taskSummaries);
    setSummaryWindow(true);

  };

  const displayTasksSummary = () => {
    // Display the summaries in the UI (box in the middle of the screen with the summaries)
    return (<div className='Option-Overlay'>
      <div className='Option-Items'>
        <h3>Tasks Summary</h3>
        <ul>
          {taskSummaries.map((taskSummary) => (
            <li key={Object.keys(taskSummary)[0]}>
              Task {Object.keys(taskSummary)[0]}:
              <ul>
                {taskSummary[Object.keys(taskSummary)[0]].map((period) => (
                  <li key={period.start}>
                    {period.start} - {period.end} ({period.hours} hours)
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        <h3>Tags summary</h3>
        <ul>
          {tagSummaries.map((tagSummary) => (
            <li key={tagSummary.tag}>
              Tag {tagSummary.tag}: {tagSummary.totalHours} hours
            </li>
          ))}
        </ul>
        <button onClick={() => { setSummaryWindow(false) }}>Close</button>
      </div>
    </div>
    )
  }

  const handleSelectChange = (e) => {
    setCurrentSummaryTask(e.target.value);
  }

  const [selectedTasks, setSelectedTasks] = useState([]);


  const handleCheckboxChange = (task) => {
    setSelectedTasks((prevSelectedTasks) => {
      if (prevSelectedTasks.some((selectedTask) => selectedTask.id === task.id)) {
        // Remove task if it's already selected
        return prevSelectedTasks.filter((selectedTask) => selectedTask.id !== task.id);
      } else {
        // Add task if it's not selected
        return [...prevSelectedTasks, task];
      }
    });
  };

  return (<div className='timelineContainer'>
    <div style={{ textAlign: "center", maxWidth: "400px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <button onClick={goToPreviousMonth}>Previous</button>
        <h2>{currentDate.toLocaleString("default", { month: "long" })} {currentYear}</h2>
        <button onClick={goToNextMonth}>Next</button>
      </div>

      {/* Date */}
      <div style={{ marginBottom: "20px" }}>
        <h3>Select Date Range</h3>
        <p>
          {calendarDateRange.start ? `Start: ${calendarDateRange.start.toLocaleDateString()} ${calendarTimeRange.startTime}` : "Start: None"}<br />
          {calendarDateRange.end ? `End: ${calendarDateRange.end.toLocaleDateString()} ${calendarTimeRange.endTime}` : "End: None"}
        </p>
        <button onClick={onTimerangeAdd}>Add time range to a list</button>
      </div>

      {/* Time */}
      <div style={{ marginBottom: "20px" }}>
        <label>
          Start Time:
          <input type="time" value={calendarTimeRange.startTime} onChange={handleStartTimeChange} />
        </label>
        <br />
        <label>
          End Time:
          <input type="time" value={calendarTimeRange.endTime} onChange={handleEndTimeChange} />
        </label>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gridGap: "5px" }}>
        {/* Days of the week */}
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} style={{ fontWeight: "bold" }}>{day}</div>
        ))}

        {/* Calendar Days */}
        {daysArray.map((day, index) => (
          <div
            key={index}
            style={{
              padding: "10px",
              border: "1px solid #ddd",
              textAlign: "center",
              backgroundColor: day && calendarDateRange.start && calendarDateRange.end
                ? isInRange(new Date(currentYear, currentMonth, day), calendarDateRange.start, calendarDateRange.end)
                  ? "lightblue"
                  : ""
                : "",
              cursor: day ? "pointer" : "default",
            }}
            onClick={() => day && handleSelectDate(day)}
          >
            {day ? day : ""}
          </div>
        ))}
      </div>
    </div>
    <div id='time_summary'>
      {/* Tabs */}
      <div>
        <button
          onClick={() => setActiveTab("multiTask")}
          style={{
            padding: "10px",
            marginRight: "5px",
            backgroundColor: activeTab === "multiTask" ? "#ddd" : "#f9f9f9",
            border: "1px solid #ccc",
            cursor: "pointer",
            color: "red",
          }}
        >
          Tasks/Tags Summary
        </button>
        <button
          onClick={() => setActiveTab("singleTask")}
          style={{
            padding: "10px",
            backgroundColor: activeTab === "singleTask" ? "#ddd" : "#f9f9f9",
            border: "1px solid #ccc",
            cursor: "pointer",
            color: "red",
          }}
        >
          Single Task Summary
        </button>
      </div>

      {/* Tab content */}
      <div style={{ display: activeTab === "multiTask" ? "block" : "none" }}>
        <h3>Tasks/Tags Summary</h3>
        <p>Tasks and tags summary here</p>
        <label>Select tasks to summarize</label>
        <div style={{padding: "10px", width: "200px" }}>
          {tasks.map((task) => (
            <label key={task.id} style={{ display: "block", cursor: "pointer" }}>
              <input
                type="checkbox"
                value={task.name}
                onChange={() => handleCheckboxChange(task)}
                checked={selectedTasks.some((selectedTask) => selectedTask.id === task.id)}
              />{" "}
              {task.id + " : " + task.name}
            </label>
          ))}
        </div>
        <div>
          <strong>Selected:</strong>{" "}
          {selectedTasks.map((task) => task.name).join(", ") || "None"}
        </div>
        <button onClick={() => { multiTaskTagSummary(selectedTasks) }}>Summarize</button>
        {summaryWindow ? displayTasksSummary() : ''}
      </div>
      <div style={{ display: activeTab === "singleTask" ? "block" : "none" }}>
        <h3>Single Task Summary</h3>
        <p>Select task to summarize</p>
        <select onChange={handleSelectChange}>
          <option value="">None</option>
          {tasks.map((task) => (
            <option key={task.id} value={task.id}>{task.name}</option>
          ))}
        </select>
        <button onClick={() => {
          if (currentSummaryTask)
            singleTaskSummary(currentSummaryTask);
          else {
            alert("Please select a task to summarize");
          }
        }
        }>Summarize</button>
        <div>Time periods (activity time)
          <ul>
            {timePeriods.length > 0 ? (
              timePeriods.map((period) => (
                <li key={period.start}>
                  {period.start} - {period.end} ({period.hours} hours)
                </li>
              ))
            ) : (
              <li>No time periods available</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  </div>
  );
};

export default Calendar;