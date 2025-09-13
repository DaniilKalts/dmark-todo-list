import { useState, useRef, useEffect } from 'react';

export default function TaskItem({
  task,
  onToggle,
  onDelete,
  onRestore,
  onHardDelete,
  isTrash = false,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = e => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative">
      <div className="flex items-center justify-between py-2 px-3 rounded-lg transition hover:bg-gray-100 dark:hover:bg-gray-800">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={!!task.completedAt}
            onChange={() => !isTrash && onToggle(task)}
            disabled={isTrash}
            className={`w-4 h-4 rounded border border-gray-300 dark:border-gray-700 text-blue-500 focus:ring-blue-500
    ${isTrash ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
          />
          <span
            className={`text-gray-800 dark:text-gray-200 ${
              task.completedAt ? 'line-through text-gray-400 dark:text-gray-500 opacity-60' : ''
            }`}
          >
            {task.title}
          </span>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="px-2 py-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          ⋮
        </button>
      </div>

      {menuOpen && (
        <div
          ref={menuRef}
          className="absolute right-2 top-full mt-1 w-40 bg-gray-800 dark:bg-gray-700 text-white rounded-md shadow-lg z-20"
        >
          {isTrash ? (
            <>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onRestore(task);
                }}
                className="block w-full text-left px-4 py-2 text-sm rounded-tr-md rounded-tl-md hover:bg-gray-600"
              >
                Восстановить
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onHardDelete(task);
                }}
                className="block w-full text-left px-4 py-2 text-sm rounded-br-md rounded-bl-md hover:bg-gray-600"
              >
                Удалить навсегда
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                setMenuOpen(false);
                onDelete(task);
              }}
              className="block w-full text-left px-4 py-2 text-sm rounded-md hover:bg-gray-600"
            >
              Удалить
            </button>
          )}
        </div>
      )}
    </div>
  );
}
