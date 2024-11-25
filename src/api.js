const API_URL = "http://localhost:3010";

export async function fetchTasks() {
  const response = await fetch(`${API_URL}/tasks`);
  return response.json();
}

export async function addTask(name, additionalData) {
  const response = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, additional_data: additionalData }),
  });
  return response.json();
}

export async function fetchTasksWtag() {
  const fooTagId = await fetch(`${API_URL}/tags?name=foo`)
    .then((res) => res.json())
    .then((tags) => tags[0]?.id);

  if (!fooTagId) return [];

  const response = await fetch(`${API_URL}/tasks?tag=${fooTagId}`);
  return response.json();
}