import { useEffect, useState } from 'react';
import TaskList from '../components/TaskList';
import TaskFilters from '../components/TaskFilters';
import EmptyState from '../components/EmptyState';

export default function PendingTasksPage({ tasks, loadTasks, onToggle, onDelete, onSetPriority }) {
  const [sort, setSort] = useState('created_at');
  const [order, setOrder] = useState('desc');

  useEffect(() => {
    loadTasks('pending', sort, order);
  }, [sort, order, loadTasks]);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-200">Текущие</h1>
        <TaskFilters
          sort={sort}
          setSort={setSort}
          order={order}
          setOrder={setOrder}
          sorts={[
            { value: 'created_at', label: 'По дате создания' },
            { value: 'priority', label: 'По приоритету' },
          ]}
          idPrefix="pending"
        />
      </div>

      <div className="flex-1 flex">
        {tasks.length === 0 ? (
          <div className="flex-1 grid place-items-center">
            <EmptyState icon="🕒" message="Здесь пока нет текущих задач. Всё под контролем!" />
          </div>
        ) : (
          <div className="w-full">
            <TaskList
              tasks={tasks}
              onToggle={task => onToggle(task, 'pending', sort, order)}
              onDelete={task => onDelete(task, 'pending', sort, order)}
              onSetPriority={(task, p) => onSetPriority(task, p, 'pending', sort, order)}
            />
          </div>
        )}
      </div>
    </>
  );
}
