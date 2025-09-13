import { useEffect, useState } from 'react';
import TaskList from '../components/TaskList';
import TaskFilters from '../components/TaskFilters';
import EmptyState from '../components/EmptyState';

export default function CompletedTasksPage({ tasks, loadTasks, onToggle, onDelete }) {
  const [order, setOrder] = useState('desc');

  useEffect(() => {
    loadTasks('completed', order);
  }, [order, loadTasks]);

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Завершённые</h1>
        <TaskFilters order={order} setOrder={setOrder} />
      </div>

      {tasks.length === 0 ? (
        <EmptyState icon="✅" message="Здесь пока нет завершённых задач. Сделай первый шаг!" />
      ) : (
        <TaskList
          tasks={tasks}
          onToggle={task => onToggle(task, 'completed', order)}
          onDelete={task => onDelete(task, 'completed', order)}
        />
      )}
    </>
  );
}
