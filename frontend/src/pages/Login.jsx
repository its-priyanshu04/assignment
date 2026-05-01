import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const getApiErrorMessage = (err, fallbackMessage) => {
  const firstValidationError = err?.response?.data?.errors?.[0]?.msg;
  return firstValidationError || err?.response?.data?.message || fallbackMessage;
};

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!formData.email.trim()) {
      setError("Email is required.");
      return;
    }

    if (!formData.password.trim()) {
      setError("Password is required.");
      return;
    }

    try {
      await login(formData);
      navigate("/dashboard");
    } catch (err) {
      setError(getApiErrorMessage(err, "Login failed."));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <form
        className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
        onSubmit={handleSubmit}
      >
        <h1 className="mb-4 text-2xl font-bold text-slate-800">Login</h1>
        {error && <p className="mb-3 rounded bg-red-100 p-2 text-sm text-red-700">{error}</p>}
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
          className="mb-4 w-full rounded border border-slate-300 px-3 py-2"
          name="password"
          onChange={handleChange}
          placeholder="Password"
          required
          type="password"
          value={formData.password}
        />
        <button
          className="w-full rounded bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700"
          type="submit"
        >
          Login
        </button>
        <p className="mt-3 text-sm text-slate-600">
          New here?{" "}
          <Link className="text-indigo-600" to="/signup">
            Create account
          </Link>
        </p>
      </form>
    </div>
  );
}
