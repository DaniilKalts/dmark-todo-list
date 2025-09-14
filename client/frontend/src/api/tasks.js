const BASE_URL = 'http://localhost:8080/api/v1/tasks';

export async function fetchTasks(filter = '', sort = '', order = 'desc') {
  let url = BASE_URL;
  const params = new URLSearchParams();
  if (filter) params.append('filter', filter);
  if (sort) params.append('sort', sort);
  if (order) params.append('order', order);
  if ([...params].length > 0) url += `?${params.toString()}`;

  const res = await fetch(url);
  return res.json();
}

export async function toggleTask(task) {
  const action = task.completedAt ? 'reopen' : 'complete';
  await fetch(`${BASE_URL}/${task.id}/${action}`, { method: 'PATCH' });
}

export async function setTaskPriority(id, priority) {
  await fetch(`${BASE_URL}/${id}/priority`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ priority }),
  });
}

export async function trashTask(task) {
  await fetch(`${BASE_URL}/${task.id}/trash`, { method: 'PATCH' });
}

export async function restoreTask(task) {
  await fetch(`${BASE_URL}/${task.id}/restore`, { method: 'PATCH' });
}

export async function hardDeleteTask(task) {
  await fetch(`${BASE_URL}/${task.id}`, { method: 'DELETE' });
}

export async function emptyTrash() {
  await fetch(`${BASE_URL}/trash`, { method: 'DELETE' });
}
