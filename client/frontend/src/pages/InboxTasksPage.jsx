import { useEffect, useState } from 'react';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import TaskFilters from '../components/TaskFilters';
import EmptyState from '../components/EmptyState';

export default function InboxTasksPage({ tasks, loadTasks, onToggle, onDelete, onSetPriority }) {
  const [pendingSortBy, setPendingSortBy] = useState('created_at');
  const [pendingOrder, setPendingOrder] = useState('desc');
  const [completedSortBy, setCompletedSortBy] = useState('completed_at');
  const [completedOrder, setCompletedOrder] = useState('desc');

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const cmpNum = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

  const sortBy = (arr, key, order) => {
    return [...arr].sort((a, b) => {
      const av = key === 'priority' ? (a.priority ?? 2) : new Date(a[key]).getTime();
      const bv = key === 'priority' ? (b.priority ?? 2) : new Date(b[key]).getTime();
      const res = cmpNum(av, bv);
      return order === 'asc' ? res : -res;
    });
  };

  const activeTasks = sortBy(
    tasks.filter(t => !t.completedAt),
    pendingSortBy === 'priority' ? 'priority' : 'createdAt',
    pendingOrder,
  );

  const completedTasks = sortBy(
    tasks.filter(t => t.completedAt),
    completedSortBy === 'priority' ? 'priority' : 'completedAt',
    completedOrder,
  );

  const isEmpty = activeTasks.length === 0 && completedTasks.length === 0;

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-200">Входящие</h1>
      </div>

      <div className="mb-6">
        <TaskForm onTaskAdded={() => loadTasks()} />
      </div>

      <section className="flex-1 flex">
        {isEmpty ? (
          <div className="flex-1 grid place-items-center">
            <EmptyState icon="📝" message="У тебя нет текущих задач. Добавь новую!" />
          </div>
        ) : (
          <div className="w-full flex flex-col space-y-6">
            {activeTasks.length > 0 && (
              <section>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 mb-2">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-600 dark:text-gray-400">
                    Текущие
                  </h2>
                  <TaskFilters
                    sort={pendingSortBy}
                    setSort={setPendingSortBy}
                    order={pendingOrder}
                    setOrder={setPendingOrder}
                    sorts={[
                      { value: 'created_at', label: 'По дате создания' },
                      { value: 'priority', label: 'По приоритету' },
                    ]}
                    idPrefix="inbox-pending"
                    className="sm:ml-4"
                  />
                </div>
                <TaskList
                  tasks={activeTasks}
                  onToggle={onToggle}
                  onDelete={onDelete}
                  onSetPriority={(task, p) => onSetPriority(task, p)}
                />
              </section>
            )}

            {completedTasks.length > 0 && (
              <section>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 mb-2">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-600 dark:text-gray-400">
                    Завершённые
                  </h2>
                  <TaskFilters
                    sort={completedSortBy}
                    setSort={setCompletedSortBy}
                    order={completedOrder}
                    setOrder={setCompletedOrder}
                    sorts={[
                      { value: 'completed_at', label: 'По дате завершения' },
                      { value: 'priority', label: 'По приоритету' },
                    ]}
                    idPrefix="inbox-completed"
                    className="sm:ml-4"
                  />
                </div>
                <TaskList
                  tasks={completedTasks}
                  onToggle={onToggle}
                  onDelete={onDelete}
                  onSetPriority={(task, p) => onSetPriority(task, p)}
                />
              </section>
            )}
          </div>
        )}
      </section>
    </>
  );
}
