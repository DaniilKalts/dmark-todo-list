import Task from './Task';

export default function TaskList({ tasks, onToggle }) {
  return (
    <div className="flex flex-col divide-y divide-gray-200 dark:divide-gray-700">
      {tasks.map(task => (
        <Task key={task.id} task={task} onToggle={onToggle} />
      ))}
    </div>
  );
}
