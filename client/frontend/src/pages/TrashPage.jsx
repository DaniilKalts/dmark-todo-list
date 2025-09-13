import { useEffect, useState } from 'react';
import TaskList from '../components/TaskList';
import TaskFilters from '../components/TaskFilters';
import EmptyState from '../components/EmptyState';

export default function TrashPage({ tasks, loadTasks, onRestore, onHardDelete }) {
  const [order, setOrder] = useState('desc');

  useEffect(() => {
    loadTasks('deleted', order);
  }, [order, loadTasks]);

  const handleRestore = async task => {
    await onRestore(task, 'deleted', order);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-200">Корзина</h1>
        <TaskFilters order={order} setOrder={setOrder} />
      </div>

      <div className="flex-1 flex">
        {tasks.length === 0 ? (
          <div className="flex-1 grid place-items-center">
            <EmptyState icon="🗑️" message="Корзина пуста. Пока нечего удалять!" />
          </div>
        ) : (
          <div className="w-full">
            <TaskList
              tasks={tasks}
              isTrash
              onRestore={handleRestore}
              onHardDelete={task => onHardDelete(task, 'deleted', order)}
            />
          </div>
        )}{' '}
      </div>
    </>
  );
}
