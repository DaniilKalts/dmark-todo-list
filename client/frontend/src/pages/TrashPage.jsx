import TaskList from '../components/TaskList';

export default function TrashPage({ tasks, onToggle, onDelete, onRestore }) {
  return (
    <>
      <h1 className="text-2xl text-gray-800 dark:text-gray-200 font-bold mb-4">Корзина</h1>
      <TaskList
        tasks={tasks}
        onToggle={onToggle}
        onDelete={onDelete}
        onRestore={onRestore}
        isTrash
      />
    </>
  );
}
