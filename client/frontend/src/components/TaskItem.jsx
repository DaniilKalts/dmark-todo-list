import { useState, useRef, useEffect } from 'react';
import ConfirmDialog from './ConfirmDialog';

const P_STYLES = {
  1: { bar: 'bg-blue-500', icon: 'text-blue-500', name: 'Низкий' },
  2: { bar: 'bg-yellow-400', icon: 'text-yellow-400', name: 'Средний' },
  3: { bar: 'bg-red-500', icon: 'text-red-500', name: 'Высокий' },
};

function FlagIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M6 2.5a1 1 0 0 0-1 1V21a1 1 0 1 0 2 0v-5h8.382a1 1 0 0 0 .724-.31l2.5-2.625a1 1 0 0 0 0-1.38l-2.5-2.625a1 1 0 0 0-.724-.31H7V3.5a1 1 0 0 0-1-1z" />
    </svg>
  );
}

export default function TaskItem({
  task,
  onToggle,
  onDelete,
  onRestore,
  onHardDelete,
  onSetPriority,
  isTrash = false,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = e => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const askHardDelete = () => {
    setMenuOpen(false);
    setConfirmDeleteOpen(true);
  };

  const confirmHardDelete = async () => {
    setConfirmDeleteOpen(false);
    await onHardDelete?.(task);
  };

  const currentP = task.priority ?? 2;

  const handlePriorityClick = async e => {
    if (!onSetPriority || isTrash) return;
    const dir = e.shiftKey ? -1 : 1;
    const next = ((currentP - 1 + dir + 3) % 3) + 1;
    await onSetPriority(task, next);
  };

  return (
    <div className="relative group">
      <div
        className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l-lg ${P_STYLES[currentP].bar}`}
        aria-hidden="true"
      />

      <div className="pl-2 flex items-start sm:items-center justify-between gap-2 py-2.5 px-3 rounded-lg transition hover:bg-gray-100 dark:hover:bg-gray-800">
        <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
          <input
            type="checkbox"
            checked={!!task.completedAt}
            onChange={() => !isTrash && onToggle(task)}
            disabled={isTrash}
            className={`w-5 h-5 md:w-4 md:h-4 rounded border border-gray-300 dark:border-gray-700 text-blue-500 focus:ring-blue-500 ${
              isTrash ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
            }`}
          />

          <button
            type="button"
            disabled={isTrash}
            onClick={handlePriorityClick}
            title={`Приоритет: ${P_STYLES[currentP].name} • Клик — следующий, Shift+клик — предыдущий`}
            aria-label={`Приоритет ${currentP}`}
            className={[
              'inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs border',
              'bg-white dark:bg-gray-900/40',
              'border-gray-200 dark:border-gray-700',
              isTrash ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-gray-800',
              P_STYLES[currentP].icon,
              'transition',
            ].join(' ')}
          >
            <FlagIcon className="w-4 h-4" />
            <span className="hidden sm:inline font-medium">P{currentP}</span>
          </button>

          <span
            className={`block flex-1 break-words text-gray-800 dark:text-gray-200 text-sm sm:text-base ${
              task.completedAt ? 'line-through text-gray-400 dark:text-gray-500 opacity-60' : ''
            }`}
          >
            {task.title}
          </span>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="shrink-0 -mr-1 px-2 py-1.5 sm:py-1 rounded-md text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          aria-label="Открыть меню действий"
        >
          ⋮
        </button>
      </div>

      {menuOpen && (
        <div
          ref={menuRef}
          className="absolute right-2 top-full mt-1 w-48 sm:w-44 bg-gray-800 dark:bg-gray-700 text-white rounded-md shadow-lg z-20 overflow-hidden"
          role="menu"
        >
          {isTrash ? (
            <>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onRestore(task);
                }}
                className="block w-full text-left px-4 py-3 sm:py-2 text-sm hover:bg-gray-600"
                role="menuitem"
              >
                Восстановить
              </button>
              <button
                onClick={askHardDelete}
                className="block w-full text-left px-4 py-3 sm:py-2 text-sm hover:bg-gray-600"
                role="menuitem"
              >
                Удалить навсегда
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onDelete(task);
                }}
                className="block w-full text-left px-4 py-3 sm:py-2 text-sm hover:bg-gray-600"
                role="menuitem"
              >
                Удалить
              </button>
            </>
          )}
        </div>
      )}

      {isTrash && (
        <ConfirmDialog
          open={confirmDeleteOpen}
          onClose={() => setConfirmDeleteOpen(false)}
          onConfirm={confirmHardDelete}
          title="Удалить задачу навсегда?"
          description="Действие необратимо. Задача будет удалена без возможности восстановления."
          confirmText="Удалить навсегда"
          cancelText="Отмена"
          tone="danger"
        />
      )}
    </div>
  );
}
