import { Link, useLocation } from 'react-router-dom';

export default function Sidebar({ pendingCount }) {
  const location = useLocation();

  const baseBtn = 'flex items-center px-3 py-2 rounded-lg transition cursor-pointer';
  const hoverBtn = 'hover:bg-gray-100 dark:hover:bg-gray-800';
  const activeBtn = 'bg-gray-100 dark:bg-gray-800 font-medium';

  return (
    <aside className="w-60 h-screen bg-white dark:bg-[#1E1E1E] text-gray-800 dark:text-gray-200 flex flex-col justify-between px-4 py-8 border-r border-gray-200 dark:border-gray-700">
      <nav className="flex flex-col gap-2">
        <Link
          to="/inbox"
          className={`${baseBtn} ${hoverBtn} ${location.pathname === '/inbox' ? activeBtn : ''} justify-between`}
        >
          <span className="flex items-center gap-3">
            <span className="text-lg">📥</span>
            <span>Входящие</span>
          </span>
          <span className="text-sm">{pendingCount}</span>
        </Link>
      </nav>

      <nav className="flex flex-col gap-2 mt-auto">
        <Link
          to="/pending"
          className={`${baseBtn} ${hoverBtn} ${location.pathname === '/pending' ? activeBtn : ''}`}
        >
          <span className="flex items-center gap-3">
            <span className="text-lg">🕒</span>
            <span>Текущие</span>
          </span>
        </Link>

        <Link
          to="/completed"
          className={`${baseBtn} ${hoverBtn} ${location.pathname === '/completed' ? activeBtn : ''}`}
        >
          <span className="flex items-center gap-3">
            <span className="text-lg">✅</span>
            <span>Завершённые</span>
          </span>
        </Link>

        <Link
          to="/trash"
          className={`${baseBtn} ${hoverBtn} ${location.pathname === '/trash' ? activeBtn : ''}`}
        >
          <span className="flex items-center gap-3">
            <span className="text-lg">🗑️</span>
            <span>Корзина</span>
          </span>
        </Link>
      </nav>
    </aside>
  );
}
