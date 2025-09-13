export default function EmptyState({ icon, message }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-gray-400 dark:text-gray-500">
      <div className="text-5xl mb-3">{icon}</div>
      <p className="text-center">{message}</p>
    </div>
  );
}
