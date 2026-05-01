import { useEffect, useState } from "react";
import TaskCard from "../components/TaskCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { getProjects } from "../services/projectService";
import {
  createTask,
  deleteTask,
  getTasks,
  updateTaskStatus,
} from "../services/taskService";
import { getUsers } from "../services/userService";

export default function Tasks() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    deadline: "",
    projectId: "",
    assignedTo: "",
  });

  const loadTasks = async (projectId) => {
    const data = await getTasks(projectId);
    setTasks(data);
  };

  useEffect(() => {
    const load = async () => {
      const [projectsData, usersData] = await Promise.all([getProjects(), getUsers()]);
      setProjects(projectsData);
      setUsers(usersData);
      await loadTasks("");
    };
    load();
  }, []);

  const handleProjectFilter = async (event) => {
    const value = event.target.value;
    setSelectedProject(value);
    await loadTasks(value);
  };

  const handleCreateTask = async (event) => {
    event.preventDefault();
    await createTask(formData);
    setFormData({
      title: "",
      description: "",
      priority: "Medium",
      deadline: "",
      projectId: "",
      assignedTo: "",
    });
    await loadTasks(selectedProject);
  };

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Tasks</h2>
        <select
          className="rounded border border-slate-300 px-3 py-2 text-sm"
          onChange={handleProjectFilter}
          value={selectedProject}
        >
          <option value="">All Projects</option>
          {projects.map((project) => (
            <option key={project._id} value={project._id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>

      {isAdmin && (
        <form className="mb-6 grid gap-2 rounded-lg border bg-white p-4 md:grid-cols-3" onSubmit={handleCreateTask}>
          <input
            className="rounded border px-3 py-2"
            placeholder="Task title"
            required
            value={formData.title}
            onChange={(event) => setFormData((prev) => ({ ...prev, title: event.target.value }))}
          />
          <input
            className="rounded border px-3 py-2"
            placeholder="Description"
            value={formData.description}
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, description: event.target.value }))
            }
          />
          <input
            className="rounded border px-3 py-2"
            required
            type="date"
            value={formData.deadline}
            onChange={(event) => setFormData((prev) => ({ ...prev, deadline: event.target.value }))}
          />
          <select
            className="rounded border px-3 py-2"
            value={formData.priority}
            onChange={(event) => setFormData((prev) => ({ ...prev, priority: event.target.value }))}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <select
            className="rounded border px-3 py-2"
            required
            value={formData.projectId}
            onChange={(event) => setFormData((prev) => ({ ...prev, projectId: event.target.value }))}
          >
            <option value="">Select project</option>
            {projects.map((project) => (
              <option key={project._id} value={project._id}>
                {project.name}
              </option>
            ))}
          </select>
          <select
            className="rounded border px-3 py-2"
            required
            value={formData.assignedTo}
            onChange={(event) => setFormData((prev) => ({ ...prev, assignedTo: event.target.value }))}
          >
            <option value="">Assign user</option>
            {users.map((member) => (
              <option key={member._id} value={member._id}>
                {member.name} ({member.email})
              </option>
            ))}
          </select>
          <button className="rounded bg-indigo-600 px-3 py-2 text-white md:col-span-3" type="submit">
            Create Task
          </button>
        </form>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            canDelete={isAdmin}
            onDelete={async (taskId) => {
              await deleteTask(taskId);
              await loadTasks(selectedProject);
            }}
            onStatusChange={async (taskId, status) => {
              await updateTaskStatus(taskId, status);
              await loadTasks(selectedProject);
            }}
          />
        ))}
      </div>
    </section>
  );
}
