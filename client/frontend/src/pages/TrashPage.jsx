import { useEffect } from 'react';
import TaskList from '../components/TaskList';

export default function TrashPage({ tasks, loadTasks, onRestore, onHardDelete }) {
  useEffect(() => {
    loadTasks('deleted');
  }, [loadTasks]);

  return (
    <>
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Корзина</h1>
      <TaskList tasks={tasks} isTrash onRestore={onRestore} onHardDelete={onHardDelete} />
    </>
  );
}
