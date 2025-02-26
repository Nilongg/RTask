const API_URL = "http://localhost:3010";

export async function fetchTasks() {
  const response = await fetch(`${API_URL}/tasks`);
  return response.json();
}

export async function fetchTags() {
  const response = await fetch(`${API_URL}/tags`);
  return response.json();
}

export async function addTask(taskName, _tags = "", additionalData = '') {
  const response = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: taskName, tags: _tags, additional_data: additionalData }),
  });
  return response.json();
}

export async function PatchTask(taskId, newTaskName, newTags = "", newAdditionalData = '') {
  const response = await fetch(`${API_URL}/tasks/${taskId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: newTaskName, tags: newTags, additional_data: newAdditionalData }),
  });
  return response.json();
}

export async function PutTask(taskId, newTaskId, newTaskName, newTags = [], newAdditionalData = '') {
  const response = await fetch(`${API_URL}/tasks/${taskId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: newTaskId, name: newTaskName, tags: newTags, additional_data: newAdditionalData }),
  });
  return response.json();
}
 

export async function addTimeStamp(currentTime, taskId, tsType) {
  const response = await fetch(`${API_URL}/timestamps`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ timestamp: currentTime, task: taskId, type: tsType }),
  });
  return response.json();

}

export async function addTag(tagName) {
  const response = await fetch(`${API_URL}/tags`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: tagName }),
  });
  return response.json();
}


export async function fetchTimeStamps() {
  const response = await fetch(`${API_URL}/timestamps`);
  return response.json();
}


export async function deleteTask(taskId) {
  const response = await fetch(`${API_URL}/tasks/${taskId}`, {
    method: "DELETE",
  });
  return response.json();
}

export async function setOptions(theme, AlternativeMode, textual_data) {
  const response = await fetch(`${API_URL}/options/1`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ theme: theme, alternative: AlternativeMode, own_textual_data: textual_data }),
  });
  return response.json();
}

export async function fetchOptions() {
  const response = await fetch(`${API_URL}/options/1`);
  return response.json();
}