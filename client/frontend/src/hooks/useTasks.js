import { useState, useCallback } from 'react';
import {
  fetchTasks,
  toggleTask,
  trashTask,
  restoreTask,
  hardDeleteTask,
  emptyTrash,
} from '../api/tasks';

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);

  const loadTasks = useCallback(async (filter = '', order = 'desc') => {
    const data = await fetchTasks(filter, order);
    setTasks(data);

    const pending = await fetchTasks('pending', 'desc');
    setPendingCount(pending.length);
  }, []);

  const handleToggleTask = async (task, filter = '', order = 'desc') => {
    await toggleTask(task);
    await loadTasks(filter, order);
  };

  const handleDeleteTask = async (task, filter = '', order = 'desc') => {
    await trashTask(task);
    await loadTasks(filter, order);
  };

  const handleRestoreTask = async (task, filter = '', order = 'desc') => {
    await restoreTask(task);
    await loadTasks(filter, order);
  };

  const handleHardDeleteTask = async (task, filter = 'deleted', order = 'desc') => {
    await hardDeleteTask(task);
    await loadTasks(filter, order);
  };

  const handleEmptyTrash = async (filter = 'deleted', order = 'desc') => {
    await emptyTrash();
    await loadTasks(filter, order);
  };

  return {
    tasks,
    pendingCount,
    loadTasks,
    handleToggleTask,
    handleDeleteTask,
    handleRestoreTask,
    handleHardDeleteTask,
    handleEmptyTrash,
  };
}
