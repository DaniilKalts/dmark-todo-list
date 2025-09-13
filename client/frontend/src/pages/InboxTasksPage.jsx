import { useEffect, useState } from 'react';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import TaskFilters from '../components/TaskFilters';
import EmptyState from '../components/EmptyState';

export default function InboxTasksPage({ tasks, loadTasks, onToggle, onDelete }) {
  const [pendingOrder, setPendingOrder] = useState('desc');
  const [completedOrder, setCompletedOrder] = useState('desc');

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const activeTasks = tasks
    .filter(t => !t.completedAt)
    .sort((a, b) =>
      pendingOrder === 'asc'
        ? new Date(a.createdAt) - new Date(b.createdAt)
        : new Date(b.createdAt) - new Date(a.createdAt),
    );

  const completedTasks = tasks
    .filter(t => t.completedAt)
    .sort((a, b) =>
      completedOrder === 'asc'
        ? new Date(a.completedAt) - new Date(b.completedAt)
        : new Date(b.completedAt) - new Date(a.completedAt),
    );

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Входящие</h1>
      </div>

      <TaskForm onTaskAdded={() => loadTasks()} />

      <section className="mt-6">
        {activeTasks.length === 0 && completedTasks.length === 0 ? (
          <EmptyState icon="📝" message="У тебя нет текущих задач. Добавь новую!" />
        ) : (
          <>
            {activeTasks.length > 0 && (
              <>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-semibold text-gray-600 dark:text-gray-400">
                    Текущие
                  </h2>
                  <TaskFilters order={pendingOrder} setOrder={setPendingOrder} />
                </div>
                <TaskList tasks={activeTasks} onToggle={onToggle} onDelete={onDelete} />
              </>
            )}
            {completedTasks.length > 0 && (
              <section className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-semibold text-gray-600 dark:text-gray-400">
                    Завершённые
                  </h2>
                  <TaskFilters order={completedOrder} setOrder={setCompletedOrder} />
                </div>
                <TaskList tasks={completedTasks} onToggle={onToggle} onDelete={onDelete} />
              </section>
            )}
          </>
        )}
      </section>
    </>
  );
}
