import TaskItem from './TaskItem.jsx';

export default function TaskList({
  tasks,
  onToggle,
  onDelete,
  onRestore,
  onHardDelete,
  isTrash = false,
}) {
  return (
    <div className="flex flex-col divide-y divide-gray-200 dark:divide-gray-700">
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
          onRestore={onRestore}
          onHardDelete={onHardDelete}
          isTrash={isTrash}
        />
      ))}
    </div>
  );
}
