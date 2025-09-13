export default function TaskFilters({ order, setOrder }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-gray-600 dark:text-gray-400 text-sm">Сортировка:</span>
      <select
        value={order}
        onChange={e => setOrder(e.target.value)}
        className="px-2 py-1 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
      >
        <option value="desc">Сначала новые</option>
        <option value="asc">Сначала старые</option>
      </select>
    </div>
  );
}
