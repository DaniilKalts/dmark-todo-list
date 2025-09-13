import { useEffect, useState } from 'react';

export default function Sidebar() {
  const [tasks, setTasks] = useState([]);
  const [activePage, setActivePage] = useState('inbox');

  useEffect(() => {
    fetch('http://localhost:8080/api/v1/tasks')
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(err => console.error('Error fetching tasks:', err));
  }, []);

  const baseBtn =
    'flex items-center justify-between px-3 py-2 rounded-lg transition cursor-pointer';
  const hoverBtn = 'hover:bg-gray-100 dark:hover:bg-gray-800';
  const activeBtn = 'bg-gray-100 dark:bg-gray-800 font-medium';

  return (
    <aside className="w-60 h-screen bg-white dark:bg-[#1E1E1E] text-gray-800 dark:text-gray-200 flex flex-col justify-between px-4 py-8 border-r border-gray-200 dark:border-gray-700">
      <nav>
        <button
          onClick={() => setActivePage('inbox')}
          className={`${baseBtn} ${hoverBtn} ${activePage === 'inbox' ? activeBtn : ''} w-full justify-between`}
        >
          <span className="flex items-center gap-3">
            <span className="text-lg">📥</span>
            <span>Входящие</span>
          </span>
          <span className="text-sm">{tasks.length}</span>
        </button>
      </nav>

      <nav className="flex flex-col gap-2">
        <button
          onClick={() => setActivePage('completed')}
          className={`${baseBtn} ${hoverBtn} ${activePage === 'completed' ? activeBtn : ''} w-full`}
        >
          <span className="flex items-center gap-3">
            <span className="text-lg">✅</span>
            <span>Завершённые</span>
          </span>
        </button>
        <button
          onClick={() => setActivePage('trash')}
          className={`${baseBtn} ${hoverBtn} ${activePage === 'trash' ? activeBtn : ''} w-full`}
        >
          <span className="flex items-center gap-3">
            <span className="text-lg">🗑️</span>
            <span>Корзина</span>
          </span>
        </button>
      </nav>
    </aside>
  );
}
