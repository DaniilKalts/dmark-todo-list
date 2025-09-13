import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Sidebar from './components/Sidebar';

import InboxPage from './pages/InboxPage';
import ActivePage from './pages/ActivePage';
import CompletedPage from './pages/CompletedPage';
import TrashPage from './pages/TrashPage';

function App() {
  const [tasks, setTasks] = useState([]);
  const [deletedTasks, setDeletedTasks] = useState([]);

  const reloadTasks = () => {
    fetch('http://localhost:8080/api/v1/tasks')
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(err => console.error('Ошибка загрузки:', err));

    fetch('http://localhost:8080/api/v1/tasks?filter=deleted')
      .then(res => res.json())
      .then(data => setDeletedTasks(data))
      .catch(err => console.error('Ошибка загрузки удалённых:', err));
  };

  useEffect(() => {
    reloadTasks();
  }, []);

  const handleTaskAdded = async newTask => {
    setTasks(prev => [...prev, newTask]);
    reloadTasks();
  };

  const handleToggleTask = async task => {
    try {
      const url = `http://localhost:8080/api/v1/tasks/${task.id}/${task.isDone ? 'undone' : 'done'}`;
      const res = await fetch(url, { method: 'PATCH' });

      if (res.ok) {
        setTasks(prev => prev.map(t => (t.id === task.id ? { ...t, isDone: !t.isDone } : t)));

        reloadTasks();
      } else {
        console.error('Ошибка при обновлении задачи');
      }
    } catch (err) {
      console.error('Ошибка сети:', err);
    }
  };

  const handleDeleteTask = async task => {
    try {
      const url = `http://localhost:8080/api/v1/tasks/${task.id}`;
      const res = await fetch(url, { method: 'PATCH' });

      if (res.ok) {
        setTasks(prev => prev.filter(t => t.id !== task.id));
        setDeletedTasks(prev => [...prev, { ...task, deleted: true }]);
        reloadTasks();
      } else {
        console.error('Ошибка при удалении задачи');
      }
    } catch (err) {
      console.error('Ошибка сети:', err);
    }
  };

  const handleRestoreTask = async task => {
    try {
      const url = `http://localhost:8080/api/v1/tasks/${task.id}/restore`;
      const res = await fetch(url, { method: 'PATCH' });

      if (res.ok) {
        setDeletedTasks(prev => prev.filter(t => t.id !== task.id));
        setTasks(prev => [...prev, { ...task, deleted: false }]);
        reloadTasks();
      } else {
        console.error('Ошибка при восстановлении задачи');
      }
    } catch (err) {
      console.error('Ошибка сети:', err);
    }
  };

  return (
    <Router>
      <div className="flex">
        <Sidebar tasks={tasks} />
        <main className="flex-1 p-8 bg-white dark:bg-[#1E1E1E]">
          <Routes>
            <Route
              path="/inbox"
              element={
                <InboxPage
                  tasks={tasks}
                  onTaskAdded={handleTaskAdded}
                  onToggle={handleToggleTask}
                  onDelete={handleDeleteTask}
                />
              }
            />
            <Route
              path="/active"
              element={
                <ActivePage tasks={tasks} onToggle={handleToggleTask} onDelete={handleDeleteTask} />
              }
            />
            <Route
              path="/completed"
              element={
                <CompletedPage
                  tasks={tasks}
                  onToggle={handleToggleTask}
                  onDelete={handleDeleteTask}
                />
              }
            />
            <Route
              path="/trash"
              element={
                <TrashPage
                  tasks={deletedTasks}
                  onToggle={handleToggleTask}
                  onDelete={handleDeleteTask}
                  onRestore={handleRestoreTask}
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
