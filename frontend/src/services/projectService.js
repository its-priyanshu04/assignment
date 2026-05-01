import api from "./api";

export const getProjects = async () => {
  const response = await api.get("/projects");
  return response.data.data;
};

export const createProject = async (payload) => {
  const response = await api.post("/projects", payload);
  return response.data.data;
};

export const deleteProject = async (projectId) => {
  await api.delete(`/projects/${projectId}`);
};

export const addProjectMember = async (projectId, memberId) => {
  const response = await api.patch(`/projects/${projectId}/members/add`, { memberId });
  return response.data.data;
};

export const removeProjectMember = async (projectId, memberId) => {
  const response = await api.patch(`/projects/${projectId}/members/remove`, { memberId });
  return response.data.data;
};
