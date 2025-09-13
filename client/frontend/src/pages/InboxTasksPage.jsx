import { useEffect } from 'react';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import EmptyState from '../components/EmptyState';

export default function InboxTasksPage({ tasks, loadTasks, onToggle, onDelete }) {
  useEffect(() => {
    loadTasks();
  }, []);

  const activeTasks = tasks.filter(t => !t.completedAt);
  const completedTasks = tasks.filter(t => t.completedAt);

  return (
    <>
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Входящие</h1>
      <TaskForm onTaskAdded={() => loadTasks()} />

      <section className="mt-6">
        {activeTasks.length === 0 && completedTasks.length === 0 ? (
          <EmptyState icon="📝" message="У тебя нет текущих задач. Добавь новую!" />
        ) : (
          <>
            {activeTasks.length > 0 && (
              <>
                <h2 className="text-lg font-semibold mb-2 text-gray-600 dark:text-gray-400">
                  Текущие
                </h2>
                <TaskList tasks={activeTasks} onToggle={onToggle} onDelete={onDelete} />
              </>
            )}

            {completedTasks.length > 0 && (
              <section className="mt-6">
                <h2 className="text-lg font-semibold mb-2 text-gray-600 dark:text-gray-400">
                  Завершённые
                </h2>
                <TaskList tasks={completedTasks} onToggle={onToggle} onDelete={onDelete} />
              </section>
            )}
          </>
        )}
      </section>
    </>
  );
}
