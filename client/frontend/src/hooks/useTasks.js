import { useState } from 'react';
import { fetchTasks, toggleTask, trashTask, restoreTask } from '../api/tasks';

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);

  const loadTasks = async (filter = '') => {
    const data = await fetchTasks(filter);
    setTasks(data);
    const pending = await fetchTasks('pending');
    setPendingCount(pending.length);
  };

  const handleToggleTask = async (task, filter = '') => {
    await toggleTask(task);
    await loadTasks(filter);
  };

  const handleDeleteTask = async (task, filter = '') => {
    await trashTask(task);
    await loadTasks(filter);
  };

  const handleRestoreTask = async task => {
    await restoreTask(task);
    await loadTasks();
  };

  return { tasks, pendingCount, loadTasks, handleToggleTask, handleDeleteTask, handleRestoreTask };
}
