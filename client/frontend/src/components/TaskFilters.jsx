export default function TaskFilters({
  order,
  setOrder,
  id = 'sort-order',
  label = 'Сортировка:',
  className = '',
}) {
  return (
    <div className={`flex w-full sm:w-auto items-center gap-2 sm:gap-3 ${className}`}>
      <label htmlFor={id} className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm shrink-0">
        {label}
      </label>

      <select
        id={id}
        value={order}
        onChange={e => setOrder(e.target.value)}
        className="
          w-full sm:w-48
          px-2 py-2 sm:py-1.5
          text-sm rounded-md
          border border-gray-300 dark:border-gray-600
          bg-white dark:bg-gray-800
          text-gray-800 dark:text-gray-200
        "
      >
        <option value="desc">Сначала новые</option>
        <option value="asc">Сначала старые</option>
      </select>
    </div>
  );
}
