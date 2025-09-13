import AddTask from '../components/AddTask';
import TaskList from '../components/TaskList';

export default function InboxPage({ tasks, onTaskAdded, onToggle, onDelete }) {
  return (
    <>
      <h1 className="text-2xl text-gray-800 dark:text-gray-200 font-bold mb-4">Входящие</h1>
      <AddTask onTaskAdded={onTaskAdded} />

      <div className="mt-6">
        <h2 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">Текущие</h2>
        <TaskList tasks={tasks.filter(t => !t.isDone)} onToggle={onToggle} onDelete={onDelete} />
      </div>

      {tasks.some(t => t.isDone) && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
            Завершённые
          </h2>
          <TaskList tasks={tasks.filter(t => t.isDone)} onToggle={onToggle} onDelete={onDelete} />
        </div>
      )}
    </>
  );
}
