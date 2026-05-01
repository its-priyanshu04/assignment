import { useEffect, useState } from "react";
import { getProjects } from "../services/projectService";
import { getDashboardSummary } from "../services/taskService";

export default function Dashboard() {
  const [summary, setSummary] = useState({ total: 0, completed: 0, pending: 0, overdue: 0 });
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");

  const loadSummary = async (projectId) => {
    const data = await getDashboardSummary(projectId);
    setSummary(data);
  };

  useEffect(() => {
    const load = async () => {
      const projectsData = await getProjects();
      setProjects(projectsData);
      await loadSummary("");
    };
    load();
  }, []);

  const handleProjectFilter = async (event) => {
    const value = event.target.value;
    setSelectedProject(value);
    await loadSummary(value);
  };

  const cards = [
    { title: "Total Tasks", value: summary.total, color: "bg-indigo-50 text-indigo-700" },
    { title: "Completed", value: summary.completed, color: "bg-emerald-50 text-emerald-700" },
    { title: "Pending", value: summary.pending, color: "bg-amber-50 text-amber-700" },
    { title: "Overdue", value: summary.overdue, color: "bg-red-50 text-red-700" },
  ];

  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>
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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div className={`rounded-lg p-4 ${card.color}`} key={card.title}>
            <p className="text-sm font-medium">{card.title}</p>
            <p className="text-3xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
