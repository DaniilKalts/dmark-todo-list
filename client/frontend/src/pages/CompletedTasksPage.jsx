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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-200">
          Завершённые
        </h1>
        <TaskFilters order={order} setOrder={setOrder} />
      </div>

      <div className="flex-1 flex">
        {tasks.length === 0 ? (
          <div className="flex-1 grid place-items-center">
            <EmptyState icon="✅" message="Здесь пока нет завершённых задач. Сделай первый шаг!" />
          </div>
        ) : (
          <div className="w-full">
            <TaskList
              tasks={tasks}
              onToggle={task => onToggle(task, 'completed', order)}
              onDelete={task => onDelete(task, 'completed', order)}
            />
          </div>
        )}
      </div>
    </>
  );
}
