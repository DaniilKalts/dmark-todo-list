export default function TaskFilters({
  sort,
  setSort,
  order,
  setOrder,
  sorts = [
    { value: 'created_at', label: 'По дате создания' },
    { value: 'priority', label: 'По приоритету' },
  ],
  idPrefix = 'filters',
  className = '',
}) {
  return (
    <div className={`flex w-full sm:w-auto items-center gap-2 sm:gap-3 ${className}`}>
      <label
        htmlFor={`${idPrefix}-sort`}
        className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm shrink-0"
      >
        Сортировать:
      </label>

      <select
        id={`${idPrefix}-sort`}
        value={sort}
        onChange={e => setSort(e.target.value)}
        className="
          w-full sm:w-48 px-2 py-2 sm:py-1.5 text-sm rounded-md
          border border-gray-300 dark:border-gray-600
          bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200
        "
      >
        {sorts.map(s => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>

      <label
        htmlFor={`${idPrefix}-order`}
        className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm shrink-0"
      >
        Порядок:
      </label>

      <select
        id={`${idPrefix}-order`}
        value={order}
        onChange={e => setOrder(e.target.value)}
        className="
          w-full sm:w-44 px-2 py-2 sm:py-1.5 text-sm rounded-md
          border border-gray-300 dark:border-gray-600
          bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200
        "
      >
        <option value="desc">Убыв.</option>
        <option value="asc">Возр.</option>
      </select>
    </div>
  );
}
