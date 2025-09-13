import { useEffect } from 'react';
import TaskList from '../components/TaskList';
import EmptyState from '../components/EmptyState';

export default function PendingTasksPage({ tasks, loadTasks, onToggle, onDelete }) {
  useEffect(() => {
    loadTasks('pending');
  }, [loadTasks]);

  return (
    <>
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Текущие</h1>
      {tasks.length === 0 ? (
        <EmptyState icon="🕒" message="Здесь пока нет текущих задач. Всё под контролем!" />
      ) : (
        <TaskList tasks={tasks} onToggle={task => onToggle(task, 'pending')} onDelete={onDelete} />
      )}
    </>
  );
}
