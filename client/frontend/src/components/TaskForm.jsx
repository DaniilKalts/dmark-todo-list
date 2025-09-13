import { useState } from 'react';
import * as Yup from 'yup';

const schema = Yup.object().shape({
  title: Yup.string()
    .trim()
    .required('Заголовок обязателен')
    .min(5, 'Минимум 5 символов')
    .max(40, 'Максимум 40 символов'),
});

export default function TaskForm({ onTaskAdded }) {
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  const validate = async () => {
    try {
      await schema.validate({ title });
      setError('');
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!(await validate())) return;

    try {
      const res = await fetch('http://localhost:8080/api/v1/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });

      if (res.ok) {
        const newTask = await res.json();
        onTaskAdded(newTask);
        setTitle('');
      }
    } catch (err) {
      console.error('Ошибка сети:', err);
    }
  };

  const handleKeyDown = e => e.key === 'Enter' && handleSubmit();

  return (
    <div className="w-full">
      <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-md overflow-hidden bg-white dark:bg-[#1E1E1E]">
        <input
          type="text"
          placeholder="Новая задача"
          value={title}
          onChange={e => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 px-3 py-2 bg-transparent outline-none text-gray-800 dark:text-gray-200 placeholder-gray-400"
        />
        <button
          onClick={handleSubmit}
          className="flex text-[22px] items-center justify-center w-10 h-10 bg-blue-500 hover:bg-blue-600 text-white dark:bg-blue-600 dark:hover:bg-blue-700 transition"
          aria-label="Добавить задачу"
        >
          +
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}
