import { useState, useCallback } from 'react';
import {
  fetchTasks,
  toggleTask,
  trashTask,
  restoreTask,
  hardDeleteTask,
  emptyTrash,
  setTaskPriority,
} from '../api/tasks';

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);

  const loadTasks = useCallback(async (filter = '', sort = '', order = 'desc') => {
    const data = await fetchTasks(filter, sort, order);
    setTasks(data);

    const pending = await fetchTasks('pending', '', 'desc');
    setPendingCount(pending.length);
  }, []);

  const handleToggleTask = async (task, filter = '', sort = '', order = 'desc') => {
    await toggleTask(task);
    await loadTasks(filter, sort, order);
  };

  const handleSetPriority = async (task, priority, filter = '', sort = '', order = 'desc') => {
    await setTaskPriority(task.id, priority);
    await loadTasks(filter, sort, order);
  };

  const handleDeleteTask = async (task, filter = '', sort = '', order = 'desc') => {
    await trashTask(task);
    await loadTasks(filter, sort, order);
  };

  const handleRestoreTask = async (task, filter = '', sort = '', order = 'desc') => {
    await restoreTask(task);
    await loadTasks(filter, sort, order);
  };

  const handleHardDeleteTask = async (task, filter = 'deleted', sort = '', order = 'desc') => {
    await hardDeleteTask(task);
    await loadTasks(filter, sort, order);
  };

  const handleEmptyTrash = async (filter = 'deleted', sort = '', order = 'desc') => {
    await emptyTrash();
    await loadTasks(filter, sort, order);
  };

  return {
    tasks,
    pendingCount,
    loadTasks,
    handleToggleTask,
    handleSetPriority,
    handleDeleteTask,
    handleRestoreTask,
    handleHardDeleteTask,
    handleEmptyTrash,
  };
}
