import { Link, useLocation } from 'react-router-dom';

export default function Sidebar({ id = 'app-sidebar', pendingCount, isOpen = false, onClose }) {
  const location = useLocation();

  const baseBtn = 'flex items-center px-3 py-2 rounded-lg transition cursor-pointer';
  const hoverBtn = 'hover:bg-gray-100 dark:hover:bg-gray-800';
  const activeBtn = 'bg-gray-100 dark:bg-gray-800 font-medium';

  const handleNavClick = () => {
    if (onClose) onClose();
  };

  return (
    <aside
      id={id}
      aria-label="Sidebar"
      className={[
        'fixed top-0 left-0 z-40 h-screen w-60 transform transition-transform',
        isOpen ? 'translate-x-0' : '-translate-x-full',
        'md:translate-x-0 md:static md:transform-none',
        'bg-white dark:bg-[#1E1E1E] text-gray-800 dark:text-gray-200',
        'border-r border-gray-200 dark:border-gray-700',
        'px-4 py-8',
      ].join(' ')}
    >
      <div className="flex h-full flex-col overflow-hidden">
        <nav className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2">
          <Link
            to="/inbox"
            onClick={handleNavClick}
            className={`${baseBtn} ${hoverBtn} ${location.pathname === '/inbox' ? activeBtn : ''} justify-between`}
          >
            <span className="flex items-center gap-3">
              <span className="text-lg">📥</span>
              <span className="text-sm md:text-base">Входящие</span>
            </span>
            <span
              className="inline-flex items-center justify-center
             text-xs md:text-sm text-gray-700 dark:text-gray-200"
            >
              {pendingCount}
            </span>
          </Link>

          <Link
            to="/pending"
            onClick={handleNavClick}
            className={`${baseBtn} ${hoverBtn} ${location.pathname === '/pending' ? activeBtn : ''}`}
          >
            <span className="flex items-center gap-3">
              <span className="text-lg">🕒</span>
              <span className="text-sm md:text-base">Текущие</span>
            </span>
          </Link>

          <Link
            to="/completed"
            onClick={handleNavClick}
            className={`${baseBtn} ${hoverBtn} ${location.pathname === '/completed' ? activeBtn : ''}`}
          >
            <span className="flex items-center gap-3">
              <span className="text-lg">✅</span>
              <span className="text-sm md:text-base">Завершённые</span>
            </span>
          </Link>
        </nav>

        <nav className="flex flex-col gap-2 mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
          <Link
            to="/trash"
            onClick={handleNavClick}
            className={`${baseBtn} ${hoverBtn} ${location.pathname === '/trash' ? activeBtn : ''}`}
          >
            <span className="flex items-center gap-3">
              <span className="text-lg">🗑️</span>
              <span className="text-sm md:text-base">Корзина</span>
            </span>
          </Link>
          <Link
            to="/settings"
            onClick={handleNavClick}
            className={`${baseBtn} ${hoverBtn} ${location.pathname === '/settings' ? activeBtn : ''}`}
          >
            <span className="flex items-center gap-3">
              <span className="text-lg">⚙️</span>
              <span className="text-sm md:text-base">Настройки</span>
            </span>
          </Link>
        </nav>
      </div>
    </aside>
  );
}
