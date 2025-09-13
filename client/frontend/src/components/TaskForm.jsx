import { useState, useMemo } from 'react';
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

  const isValid = useMemo(() => schema.isValidSync({ title }), [title]);

  const validateOnSubmit = async () => {
    try {
      await schema.validate({ title }, { abortEarly: true });
      setError('');
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const handleChange = e => {
    const next = e.target.value;
    setTitle(next);
    if (error && schema.isValidSync({ title: next })) setError('');
  };

  const handleSubmit = async () => {
    if (!(await validateOnSubmit())) return;

    try {
      const payload = { title: title.trim() };
      const res = await fetch('http://localhost:8080/api/v1/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const newTask = await res.json();
        onTaskAdded(newTask);
        setTitle('');
        setError('');
      }
    } catch (err) {
      console.error('Ошибка сети:', err);
    }
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter' && isValid) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full">
      <div
        className="
          flex items-center border border-gray-300 dark:border-gray-700 rounded-md
          bg-white dark:bg-[#1E1E1E] shadow-sm
          focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2
          dark:focus-within:ring-offset-[#1E1E1E]
        "
      >
        <input
          type="text"
          placeholder="Новая задача"
          value={title}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          enterKeyHint="done"
          aria-invalid={!!error}
          className="
            flex-1 px-3
            py-3 md:py-2
            bg-transparent outline-none
            text-gray-800 dark:text-gray-200 placeholder-gray-400
            text-base md:text-sm
          "
        />

        <button
          onClick={handleSubmit}
          disabled={!isValid}
          className="
            flex items-center justify-center
            w-12 h-12 md:w-10 md:h-10
            text-[24px] md:text-[22px]
            bg-blue-500 hover:bg-blue-600 text-white
            dark:bg-blue-600 dark:hover:bg-blue-700
            transition
            disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-blue-500
          "
          aria-label="Добавить задачу"
        >
          +
        </button>
      </div>

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}
