const BASE_URL = 'http://localhost:8080/api/v1/tasks';

export async function fetchTasks(filter = '') {
  const url = filter ? `${BASE_URL}?filter=${filter}` : BASE_URL;
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
