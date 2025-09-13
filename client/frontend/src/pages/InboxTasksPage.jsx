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
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-200">Входящие</h1>
      </div>

      <TaskForm onTaskAdded={() => loadTasks()} />

      <section className="mt-6 flex-1 flex flex-col">
        {activeTasks.length === 0 && completedTasks.length === 0 ? (
          <div className="flex-1 grid place-items-center">
            <EmptyState icon="📝" message="У тебя нет текущих задач. Добавь новую!" />
          </div>
        ) : (
          <>
            {activeTasks.length > 0 && (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 mb-2">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-600 dark:text-gray-400">
                    Текущие
                  </h2>
                  <TaskFilters
                    id="inbox-pending-order"
                    order={pendingOrder}
                    setOrder={setPendingOrder}
                    className="sm:ml-4"
                  />
                </div>
                <TaskList tasks={activeTasks} onToggle={onToggle} onDelete={onDelete} />
              </>
            )}

            {completedTasks.length > 0 && (
              <section className="mt-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 mb-2">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-600 dark:text-gray-400">
                    Завершённые
                  </h2>
                  <TaskFilters
                    id="inbox-completed-order"
                    order={completedOrder}
                    setOrder={setCompletedOrder}
                    className="sm:ml-4"
                  />
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
