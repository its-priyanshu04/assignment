import api from "./api";

export const getTasks = async (projectId) => {
  const response = await api.get("/tasks", {
    params: projectId ? { projectId } : {},
  });
  return response.data.data;
};

export const createTask = async (payload) => {
  const response = await api.post("/tasks", payload);
  return response.data.data;
};

export const updateTaskStatus = async (taskId, status) => {
  const response = await api.patch(`/tasks/${taskId}/status`, { status });
  return response.data.data;
};

export const deleteTask = async (taskId) => {
  await api.delete(`/tasks/${taskId}`);
};

export const getDashboardSummary = async (projectId) => {
  const response = await api.get("/tasks/dashboard/summary", {
    params: projectId ? { projectId } : {},
  });
  return response.data.data;
};
