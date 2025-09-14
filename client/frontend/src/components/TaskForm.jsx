import { useState, useMemo, useEffect } from 'react';
import * as Yup from 'yup';

const P_STYLES = {
  1: { bar: 'bg-blue-500', icon: 'text-blue-500', name: 'Низкий' },
  2: { bar: 'bg-yellow-400', icon: 'text-yellow-400', name: 'Средний' },
  3: { bar: 'bg-red-500', icon: 'text-red-500', name: 'Высокий' },
};

function FlagIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M6 2.5a1 1 0 0 0-1 1V21a1 1 0 1 0 2 0v-5h8.382a1 1 0 0 0 .724-.31l2.5-2.625a1 1 0 0 0 0-1.38l-2.5-2.625a1 1 0 0 0-.724-.31H7V3.5a1 1 0 0 0-1-1z" />
    </svg>
  );
}

const schema = Yup.object().shape({
  title: Yup.string()
    .trim()
    .required('Заголовок обязателен')
    .min(5, 'Минимум 5 символов')
    .max(40, 'Максимум 40 символов'),
  priority: Yup.number().oneOf([1, 2, 3], 'Приоритет должен быть 1, 2 или 3'),
});

export default function TaskForm({ onTaskAdded }) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState(2); // P2 по умолчанию
  const [error, setError] = useState('');

  useEffect(() => {
    if (title === '') {
      setError('');
      return;
    }
    try {
      schema.validateSync({ title, priority }, { abortEarly: true });
      setError('');
    } catch (err) {
      setError(err.message);
    }
  }, [title, priority]);

  const isValid = useMemo(() => schema.isValidSync({ title, priority }), [title, priority]);

  const validateOnSubmit = async () => {
    try {
      await schema.validate({ title, priority }, { abortEarly: true });
      setError('');
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!(await validateOnSubmit())) return;

    try {
      const payload = { title: title.trim(), priority };
      const res = await fetch('http://localhost:8080/api/v1/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const newTask = await res.json();
        onTaskAdded(newTask);
        setTitle('');
        setPriority(2);
        setError('');
      }
    } catch (err) {
      console.error('Ошибка сети:', err);
    }
  };

  const hasError = !!error;

  return (
    <div className="w-full">
      <div
        className={
          `flex items-center gap-2 border rounded-md bg-white dark:bg-[#1E1E1E] shadow-sm 
           focus-within:ring-2 focus-within:ring-offset-2 dark:focus-within:ring-offset-[#1E1E1E] ` +
          (hasError
            ? 'border-red-500 focus-within:ring-red-500'
            : 'border-gray-300 dark:border-gray-700 focus-within:ring-blue-500')
        }
      >
        <input
          type="text"
          placeholder="Новая задача"
          value={title}
          onChange={e => setTitle(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSubmit();
            }
          }}
          enterKeyHint="done"
          aria-invalid={hasError}
          aria-describedby={hasError ? 'title-error' : undefined}
          className="
            flex-1 px-3 py-2 md:py-2
            bg-transparent outline-none
            text-gray-800 dark:text-gray-200 placeholder-gray-400
            text-sm md:text-base
          "
        />

        <button
          onClick={handleSubmit}
          disabled={!isValid}
          className="
            flex items-center justify-center
            w-10 h-10 md:w-8 md:h-8
            text-[24px] md:text-[22px]
            bg-blue-500 hover:bg-blue-600 text-white
            dark:bg-blue-600 dark:hover:bg-blue-700
            transition
            rounded-md
            disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-blue-500
          "
          aria-label="Добавить задачу"
        >
          +
        </button>
      </div>

      {hasError && (
        <p id="title-error" className="mt-2 text-sm text-red-500" aria-live="polite">
          {error}
        </p>
      )}

      <div className="mt-3 flex items-center gap-2">
        <span className="text-xs text-gray-600 dark:text-gray-400">Приоритет:</span>
        <div className="flex items-center gap-1" role="group" aria-label="Выбор приоритета">
          {[1, 2, 3].map(p => (
            <button
              key={p}
              type="button"
              onClick={() => setPriority(p)}
              aria-pressed={priority === p}
              title={`Приоритет: ${P_STYLES[p].name}`}
              className={[
                'inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs border transition',
                'bg-white dark:bg-gray-900/40',
                'border-gray-200 dark:border-gray-700',
                priority === p ? 'ring-2 ring-offset-1 dark:ring-offset-[#1E1E1E]' : '',
                P_STYLES[p].icon,
              ].join(' ')}
            >
              <FlagIcon className="w-4 h-4" />
              <span className="font-medium">P{p}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
        <span>{title.length}/40</span>
        <span className="inline-flex items-center gap-1">
          <span className={`inline-block w-2.5 h-2.5 rounded-full ${P_STYLES[priority].bar}`} />
          <span className="text-gray-400">P{priority}</span>
        </span>
      </div>
    </div>
  );
}
