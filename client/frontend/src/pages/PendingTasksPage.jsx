import { useEffect, useState } from 'react';
import TaskList from '../components/TaskList';
import TaskFilters from '../components/TaskFilters';
import EmptyState from '../components/EmptyState';

export default function PendingTasksPage({ tasks, loadTasks, onToggle, onDelete }) {
  const [order, setOrder] = useState('desc');

  useEffect(() => {
    loadTasks('pending', order);
  }, [order, loadTasks]);

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Текущие</h1>
        <TaskFilters order={order} setOrder={setOrder} />
      </div>

      {tasks.length === 0 ? (
        <EmptyState icon="🕒" message="Здесь пока нет текущих задач. Всё под контролем!" />
      ) : (
        <TaskList
          tasks={tasks}
          onToggle={task => onToggle(task, 'pending', order)}
          onDelete={task => onDelete(task, 'pending', order)}
        />
      )}
    </>
  );
}
