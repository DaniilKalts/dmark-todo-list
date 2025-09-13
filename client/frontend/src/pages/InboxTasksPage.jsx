import { useEffect } from 'react';

import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';

export default function InboxView({ tasks, loadTasks, onToggle, onDelete }) {
  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <>
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Входящие</h1>
      <TaskForm onTaskAdded={() => loadTasks()} />

      <section className="mt-6">
        <h2 className="text-lg font-semibold mb-2 text-gray-600 dark:text-gray-400">Текущие</h2>
        <TaskList
          tasks={tasks.filter(t => !t.completedAt)}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      </section>

      {tasks.some(t => t.completedAt) && (
        <section className="mt-6">
          <h2 className="text-lg font-semibold mb-2 text-gray-600 dark:text-gray-400">
            Завершённые
          </h2>
          <TaskList
            tasks={tasks.filter(t => t.completedAt)}
            onToggle={onToggle}
            onDelete={onDelete}
          />
        </section>
      )}
    </>
  );
}
