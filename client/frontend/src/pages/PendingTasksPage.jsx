import { useEffect } from 'react';
import TaskList from '../components/TaskList';

export default function PendingTasksPage({ tasks, loadTasks, onToggle }) {
  useEffect(() => {
    loadTasks('pending');
  }, [loadTasks]);

  return (
    <>
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Текущие</h1>
      <TaskList tasks={tasks} onToggle={task => onToggle(task, 'pending')} />
    </>
  );
}
