import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const getApiErrorMessage = (err, fallbackMessage) => {
  const firstValidationError = err?.response?.data?.errors?.[0]?.msg;
  return firstValidationError || err?.response?.data?.message || fallbackMessage;
};

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "member",
  });
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!formData.name.trim()) {
      setError("Name is required.");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      await signup(formData);
      navigate("/dashboard");
    } catch (err) {
      setError(getApiErrorMessage(err, "Signup failed."));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <form
        className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
        onSubmit={handleSubmit}
      >
        <h1 className="mb-4 text-2xl font-bold text-slate-800">Signup</h1>
        {error && <p className="mb-3 rounded bg-red-100 p-2 text-sm text-red-700">{error}</p>}
        <input
          className="mb-3 w-full rounded border border-slate-300 px-3 py-2"
          name="name"
          onChange={handleChange}
          placeholder="Name"
          required
          value={formData.name}
        />
        <input
          className="mb-3 w-full rounded border border-slate-300 px-3 py-2"
          name="email"
          onChange={handleChange}
          placeholder="Email"
          required
          type="email"
          value={formData.email}
        />
        <input
          className="mb-3 w-full rounded border border-slate-300 px-3 py-2"
          name="password"
          onChange={handleChange}
          placeholder="Password"
          required
          type="password"
          value={formData.password}
        />
        <select
          className="mb-4 w-full rounded border border-slate-300 px-3 py-2"
          name="role"
          onChange={handleChange}
          value={formData.role}
        >
          <option value="member">Member</option>
          <option value="admin">Admin</option>
        </select>
        <button
          className="w-full rounded bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700"
          type="submit"
        >
          Signup
        </button>
        <p className="mt-3 text-sm text-slate-600">
          Already have an account?{" "}
          <Link className="text-indigo-600" to="/login">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
