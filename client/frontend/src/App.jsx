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

  return (
    <Router>
      <div className="flex">
        <Sidebar pendingCount={pendingCount} />
        <main className="flex-1 p-8 bg-white dark:bg-[#1E1E1E]">
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
