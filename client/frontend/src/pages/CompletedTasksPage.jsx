import { useEffect } from 'react';
import TaskList from '../components/TaskList';

export default function CompletedTasksPage({ tasks, loadTasks, onToggle }) {
  useEffect(() => {
    loadTasks('completed');
  }, [loadTasks]);

  return (
    <>
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Завершённые</h1>
      <TaskList tasks={tasks} onToggle={task => onToggle(task, 'completed')} />
    </>
  );
}
