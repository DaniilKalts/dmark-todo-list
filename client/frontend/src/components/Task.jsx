import { useState } from 'react';

export default function Task({ task, onToggle, onDelete, onRestore, isTrash = false }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={task.isDone}
          onChange={() => !isTrash && onToggle(task)}
          disabled={isTrash}
          className={`w-4 h-4 rounded border border-gray-300 dark:border-gray-700 text-blue-500 focus:ring-blue-500 ${
            isTrash ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
          }`}
        />
        <span
          className={`text-gray-800 dark:text-gray-200 ${
            task.isDone ? 'line-through text-gray-400 dark:text-gray-500 opacity-60' : ''
          }`}
        >
          {task.title}
        </span>
      </div>

      <div className="relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          ⋮
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-[#2a2a2a] shadow-lg rounded-md border border-gray-200 dark:border-gray-700 z-10">
            {isTrash ? (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onRestore(task);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Восстановить
              </button>
            ) : (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onDelete(task);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Удалить
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
