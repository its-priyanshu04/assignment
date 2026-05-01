import StatusBadge from "./StatusBadge.jsx";

export default function TaskCard({ task, canDelete, onDelete, onStatusChange }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">{task.title}</h3>
          <p className="text-sm text-slate-600">{task.description}</p>
        </div>
        <StatusBadge status={task.status} />
      </div>
      <div className="mb-3 grid grid-cols-2 gap-2 text-xs text-slate-500">
        <span>Priority: {task.priority}</span>
        <span>Deadline: {new Date(task.deadline).toLocaleDateString()}</span>
        <span>Project: {task.project?.name}</span>
        <span>Assigned to: {task.assignedTo?.name}</span>
      </div>
      {task.isOverdue && (
        <p className="mb-2 rounded bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
          Overdue
        </p>
      )}
      <div className="flex items-center gap-2">
        <select
          className="rounded border border-slate-300 px-2 py-1 text-sm"
          onChange={(event) => onStatusChange(task._id, event.target.value)}
          value={task.status}
        >
          <option value="Todo">Todo</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        {canDelete && (
          <button
            className="rounded bg-red-500 px-2 py-1 text-xs font-medium text-white"
            onClick={() => onDelete(task._id)}
            type="button"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
