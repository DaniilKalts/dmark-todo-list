import { useState } from 'react';

import Sidebar from './components/Sidebar';
import AddTask from './components/AddTask';

function App() {
  const [tasks, setTasks] = useState([]);

  const handleTaskAdded = newTask => {
    setTasks(prev => [...prev, newTask]);
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8 bg-white dark:bg-[#1E1E1E]">
        <h1 className="text-2xl text-gray-800 dark:text-gray-200 font-bold mt-2 pb-3">Входящие</h1>
        <AddTask onTaskAdded={handleTaskAdded} />
      </main>
    </div>
  );
}

export default App;
