const BASE_URL = 'http://localhost:8080/api/v1/tasks';

export async function fetchTasks(filter = '', order = 'desc') {
  let url = BASE_URL;
  const params = new URLSearchParams();
  if (filter) params.append('filter', filter);
  if (order) params.append('order', order);
  if ([...params].length > 0) url += `?${params.toString()}`;

  const res = await fetch(url);
  return res.json();
}

export async function toggleTask(task) {
  const action = task.completedAt ? 'reopen' : 'complete';
  await fetch(`${BASE_URL}/${task.id}/${action}`, { method: 'PATCH' });
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
