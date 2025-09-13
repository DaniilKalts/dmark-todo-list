export default function TaskItem({ task, onToggle, onDelete, onRestore, isTrash = false }) {
  return (
    <div className="relative flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={!!task.completedAt}
          onChange={() => !isTrash && onToggle(task)}
          disabled={isTrash}
        />
        <span
          className={`text-gray-800 dark:text-gray-200 ${
            task.completedAt ? 'line-through text-gray-400 dark:text-gray-500 opacity-60' : ''
          }`}
        >
          {task.title}
        </span>
      </div>

      <div>
        {isTrash ? (
          <button
            onClick={() => onRestore(task)}
            className="text-green-600 hover:underline text-sm"
          >
            Восстановить
          </button>
        ) : (
          <button onClick={() => onDelete(task)} className="text-red-600 hover:underline text-sm">
            Удалить
          </button>
        )}
      </div>
    </div>
  );
}
