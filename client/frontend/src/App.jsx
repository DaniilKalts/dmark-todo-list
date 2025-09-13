import './App.css';

import Sidebar from './components/Sidebar';

function App() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8 bg-white dark:bg-[#1E1E1E]">
        <h1 className="text-2xl py-1 text-gray-800 dark:text-gray-200 font-bold">
          Здесь будут задачи...
        </h1>
      </main>
    </div>
  );
}

export default App;
