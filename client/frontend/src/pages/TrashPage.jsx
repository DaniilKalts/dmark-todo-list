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
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Корзина</h1>
        <TaskFilters order={order} setOrder={setOrder} />
      </div>

      {tasks.length === 0 ? (
        <EmptyState icon="🗑️" message="Корзина пуста. Пока нечего удалять!" />
      ) : (
        <TaskList
          tasks={tasks}
          isTrash
          onRestore={handleRestore}
          onHardDelete={task => onHardDelete(task, 'deleted', order)}
        />
      )}
    </>
  );
}
