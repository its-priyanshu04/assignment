import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return null;
  }

  const navClass = (path) =>
    `rounded-md px-3 py-2 text-sm font-medium ${
      location.pathname.startsWith(path)
        ? "bg-indigo-600 text-white"
        : "text-slate-700 hover:bg-slate-200"
    }`;

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold text-slate-800">Task Manager</h1>
          <span className="rounded bg-slate-100 px-2 py-1 text-xs uppercase text-slate-600">
            {user.role}
          </span>
        </div>
        <nav className="flex gap-2">
          <Link className={navClass("/dashboard")} to="/dashboard">
            Dashboard
          </Link>
          <Link className={navClass("/projects")} to="/projects">
            Projects
          </Link>
          <Link className={navClass("/tasks")} to="/tasks">
            Tasks
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-600">{user.name}</span>
          <button
            className="rounded bg-red-500 px-3 py-2 text-sm font-medium text-white hover:bg-red-600"
            onClick={logout}
            type="button"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
