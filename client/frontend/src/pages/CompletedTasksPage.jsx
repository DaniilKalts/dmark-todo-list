import { useEffect } from 'react';
import TaskList from '../components/TaskList';
import EmptyState from '../components/EmptyState';

export default function CompletedTasksPage({ tasks, loadTasks, onToggle, onDelete }) {
  useEffect(() => {
    loadTasks('completed');
  }, [loadTasks]);

  return (
    <>
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Завершённые</h1>
      {tasks.length === 0 ? (
        <EmptyState icon="✅" message="Здесь пока нет завершённых задач. Сделай первый шаг!" />
      ) : (
        <TaskList
          tasks={tasks}
          onToggle={task => onToggle(task, 'completed')}
          onDelete={onDelete}
        />
      )}
    </>
  );
}
