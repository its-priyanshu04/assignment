export default function ProjectCard({
  project,
  canManage,
  users,
  onDelete,
  onAddMember,
  onRemoveMember,
}) {
  const availableUsers = users.filter(
    (u) =>
      u._id !== project.owner?._id &&
      !project.members?.some((member) => member._id === u._id)
  );

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-800">{project.name}</h3>
        <span className="text-xs text-slate-500">
          Deadline: {new Date(project.deadline).toLocaleDateString()}
        </span>
      </div>
      <p className="mb-3 text-sm text-slate-600">{project.description}</p>
      <div className="mb-3">
        <p className="mb-2 text-xs font-semibold uppercase text-slate-500">Members</p>
        <div className="flex flex-wrap gap-2">
          {project.members?.length ? (
            project.members.map((member) => (
              <div
                className="flex items-center gap-1 rounded bg-slate-100 px-2 py-1 text-xs"
                key={member._id}
              >
                <span>{member.name}</span>
                {canManage && (
                  <button
                    className="text-red-600"
                    onClick={() => onRemoveMember(project._id, member._id)}
                    type="button"
                  >
                    x
                  </button>
                )}
              </div>
            ))
          ) : (
            <span className="text-xs text-slate-400">No members added yet.</span>
          )}
        </div>
      </div>
      {canManage && (
        <div className="flex items-center gap-2">
          <select
            className="rounded border border-slate-300 px-2 py-1 text-sm"
            defaultValue=""
            onChange={(event) => {
              if (event.target.value) {
                onAddMember(project._id, event.target.value);
                event.target.value = "";
              }
            }}
          >
            <option value="">Add member</option>
            {availableUsers.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
          <button
            className="rounded bg-red-500 px-2 py-1 text-xs font-medium text-white"
            onClick={() => onDelete(project._id)}
            type="button"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
