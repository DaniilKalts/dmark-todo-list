import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useTasks } from './hooks/useTasks';
import Sidebar from './components/Sidebar';

import InboxTasksPage from './pages/InboxTasksPage.jsx';
import PendingTasksPage from './pages/PendingTasksPage.jsx';
import CompletedTasksPage from './pages/CompletedTasksPage.jsx';
import TrashPage from './pages/TrashPage';

function App() {
  const {
    tasks,
    pendingCount,
    loadTasks,
    handleToggleTask,
    handleDeleteTask,
    handleRestoreTask,
    handleHardDeleteTask,
  } = useTasks();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      <div className="flex min-h-screen">
        <Sidebar
          id="app-sidebar"
          pendingCount={pendingCount}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/30 md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        <main className="flex-1 p-8 bg-white dark:bg-[#1E1E1E] flex flex-col">
          <button
            type="button"
            aria-controls="app-sidebar"
            aria-expanded={sidebarOpen}
            onClick={() => setSidebarOpen(true)}
            className="inline-flex items-center mb-4 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          >
            <span className="sr-only">Открыть меню</span>
            <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
              />
            </svg>
          </button>

          <Routes>
            <Route
              path="/inbox"
              element={
                <InboxTasksPage
                  tasks={tasks}
                  loadTasks={loadTasks}
                  onToggle={handleToggleTask}
                  onDelete={handleDeleteTask}
                />
              }
            />
            <Route
              path="/pending"
              element={
                <PendingTasksPage
                  tasks={tasks}
                  loadTasks={loadTasks}
                  onToggle={handleToggleTask}
                  onDelete={handleDeleteTask}
                />
              }
            />
            <Route
              path="/completed"
              element={
                <CompletedTasksPage
                  tasks={tasks}
                  loadTasks={loadTasks}
                  onToggle={handleToggleTask}
                  onDelete={handleDeleteTask}
                />
              }
            />
            <Route
              path="/trash"
              element={
                <TrashPage
                  tasks={tasks}
                  loadTasks={loadTasks}
                  onRestore={handleRestoreTask}
                  onHardDelete={handleHardDeleteTask}
                />
              }
            />
            <Route path="*" element={<Navigate to="/inbox" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
