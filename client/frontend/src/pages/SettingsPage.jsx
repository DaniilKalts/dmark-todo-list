import useTheme from '../hooks/useTheme';

export default function SettingsPage() {
  const { isDark, toggle } = useTheme();

  const themeName = isDark ? 'Тёмная тема' : 'Светлая тема';
  const toggleAria = isDark ? 'Переключить на светлую тему' : 'Переключить на тёмную тему';

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-200">Настройки</h1>

      <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-[#1E1E1E]">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm sm:text-base font-medium text-gray-800 dark:text-gray-200">
              {themeName}
            </div>
          </div>

          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={isDark}
              onChange={toggle}
              aria-label={toggleAria}
            />
            <div
              className="relative w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full
                          peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800
                          peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full
                          peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px]
                          after:bg-white after:border-gray-300 dark:after:border-gray-600 after:border after:rounded-full
                          after:h-5 after:w-5 after:transition-all
                          peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"
            />
          </label>
        </div>
      </div>
    </div>
  );
}
