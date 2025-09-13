import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Sidebar from './components/Sidebar';
import AddTask from './components/AddTask';
import TaskList from './components/TaskList';

function App() {
  const [tasks, setTasks] = useState([]);
  const [deletedTasks, setDeletedTasks] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/v1/tasks')
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(err => console.error('Ошибка загрузки:', err));

    fetch('http://localhost:8080/api/v1/tasks?filter=deleted')
      .then(res => res.json())
      .then(data => setDeletedTasks(data))
      .catch(err => console.error('Ошибка загрузки удалённых:', err));
  }, []);

  const handleTaskAdded = newTask => {
    setTasks(prev => [...prev, newTask]);
  };

  const handleToggleTask = async task => {
    try {
      const url = `http://localhost:8080/api/v1/tasks/${task.id}/${task.isDone ? 'undone' : 'done'}`;
      const res = await fetch(url, { method: 'PATCH' });

      if (res.ok) {
        setTasks(prev => prev.map(t => (t.id === task.id ? { ...t, isDone: !t.isDone } : t)));
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
                <>
                  <h1 className="text-2xl text-gray-800 dark:text-gray-200 font-bold mb-4">
                    Входящие
                  </h1>
                  <AddTask onTaskAdded={handleTaskAdded} />

                  <div className="mt-6">
                    <h2 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                      Текущие
                    </h2>
                    <TaskList
                      tasks={tasks.filter(t => !t.isDone)}
                      onToggle={handleToggleTask}
                      onDelete={handleDeleteTask}
                    />
                  </div>

                  {tasks.some(t => t.isDone) && (
                    <div className="mt-6">
                      <h2 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                        Завершённые
                      </h2>
                      <TaskList
                        tasks={tasks.filter(t => t.isDone)}
                        onToggle={handleToggleTask}
                        onDelete={handleDeleteTask}
                      />
                    </div>
                  )}
                </>
              }
            />

            <Route
              path="/completed"
              element={
                <>
                  <h1 className="text-2xl text-gray-800 dark:text-gray-200 font-bold mb-4">
                    Завершённые
                  </h1>
                  <TaskList
                    tasks={tasks.filter(t => t.isDone)}
                    onToggle={handleToggleTask}
                    onDelete={handleDeleteTask}
                  />
                </>
              }
            />

            <Route
              path="/trash"
              element={
                <>
                  <h1 className="text-2xl text-gray-800 dark:text-gray-200 font-bold mb-4">
                    Корзина
                  </h1>
                  <TaskList
                    tasks={deletedTasks}
                    onToggle={handleToggleTask}
                    onDelete={handleDeleteTask}
                    onRestore={handleRestoreTask}
                    isTrash={true}
                  />
                </>
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
