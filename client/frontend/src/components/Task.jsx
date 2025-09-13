export default function Task({ task, onToggle }) {
  return (
    <div className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer">
      <input
        type="checkbox"
        checked={task.isDone}
        onChange={() => onToggle(task)}
        className="w-4 h-4 rounded border border-gray-300 dark:border-gray-700 text-blue-500 focus:ring-blue-500"
      />
      <span
        className={`text-gray-800 dark:text-gray-200 ${
          task.isDone ? 'line-through text-gray-400 dark:text-gray-500 opacity-60' : ''
        }`}
      >
        {task.title}
      </span>
    </div>
  );
}
