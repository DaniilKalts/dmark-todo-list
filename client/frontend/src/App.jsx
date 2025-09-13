import Sidebar from './components/Sidebar';
import AddTask from './components/AddTask';
import TaskList from './components/TaskList';
import { useState, useEffect } from 'react';

function App() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/v1/tasks')
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(err => console.error('Ошибка загрузки:', err));
  }, []);

  const handleTaskAdded = newTask => {
    setTasks(prev => [...prev, newTask]);
  };

  const handleToggleTask = async task => {
    try {
      const url = `http://localhost:8080/api/v1/tasks/${task.id}/${
        task.isDone ? 'undone' : 'done'
      }`;

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

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8 bg-white dark:bg-[#1E1E1E]">
        <h1 className="text-2xl text-gray-800 dark:text-gray-200 font-bold mt-2 mb-4">
          Здесь будут таски...
        </h1>
        <AddTask onTaskAdded={handleTaskAdded} />
        <TaskList tasks={tasks} onToggle={handleToggleTask} />
      </main>
    </div>
  );
}

export default App;
