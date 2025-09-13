import TaskList from '../components/TaskList';

export default function CompletedPage({ tasks, onToggle, onDelete }) {
  return (
    <>
      <h1 className="text-2xl text-gray-800 dark:text-gray-200 font-bold mb-4">Завершённые</h1>
      <TaskList tasks={tasks.filter(t => t.isDone)} onToggle={onToggle} onDelete={onDelete} />
    </>
  );
}
