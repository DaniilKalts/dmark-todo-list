import TaskItem from './TaskItem';

export default function TaskList({
  tasks,
  onToggle,
  onDelete,
  onRestore,
  onHardDelete,
  onSetPriority,
  isTrash = false,
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {tasks.map(t => (
        <TaskItem
          key={t.id}
          task={t}
          onToggle={onToggle}
          onDelete={onDelete}
          onRestore={onRestore}
          onHardDelete={onHardDelete}
          onSetPriority={onSetPriority} // NEW
          isTrash={isTrash}
        />
      ))}
    </div>
  );
}
