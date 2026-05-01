import { useEffect, useState } from "react";
import ProjectCard from "../components/ProjectCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { getUsers } from "../services/userService";
import {
  addProjectMember,
  createProject,
  deleteProject,
  getProjects,
  removeProjectMember,
} from "../services/projectService";

export default function Projects() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ name: "", description: "", deadline: "" });

  const loadData = async () => {
    const [projectsData, usersData] = await Promise.all([getProjects(), getUsers()]);
    setProjects(projectsData);
    setUsers(usersData);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await createProject(formData);
    setFormData({ name: "", description: "", deadline: "" });
    await loadData();
  };

  return (
    <section>
      <h2 className="mb-4 text-2xl font-bold text-slate-800">Projects</h2>
      {isAdmin && (
        <form className="mb-6 grid gap-2 rounded-lg border bg-white p-4 md:grid-cols-4" onSubmit={handleSubmit}>
          <input
            className="rounded border px-3 py-2"
            placeholder="Project name"
            required
            value={formData.name}
            onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
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
          <button className="rounded bg-indigo-600 px-3 py-2 text-white" type="submit">
            Create Project
          </button>
        </form>
      )}
      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard
            key={project._id}
            project={project}
            users={users}
            canManage={isAdmin}
            onDelete={async (projectId) => {
              await deleteProject(projectId);
              await loadData();
            }}
            onAddMember={async (projectId, memberId) => {
              await addProjectMember(projectId, memberId);
              await loadData();
            }}
            onRemoveMember={async (projectId, memberId) => {
              await removeProjectMember(projectId, memberId);
              await loadData();
            }}
          />
        ))}
      </div>
    </section>
  );
}
