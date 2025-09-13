export default function EmptyState({ icon, message }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-gray-400 dark:text-gray-500">
      <div className="text-4xl sm:text-5xl mb-3">{icon}</div>
      <p className="text-center text-sm sm:text-base px-4">{message}</p>
    </div>
  );
}
