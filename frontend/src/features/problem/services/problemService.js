import apiClient from "../../../shared/api/apiClient";

// ✅ GET ALL PROBLEMS
export const getProblems = async () => {
  const res = await apiClient.get("/problems");
  return res.data;
};

// ✅ GET SINGLE (slug or id)
export const getProblemById = async (id) => {
  const res = await apiClient.get(`/problems/${id}`);
  return res.data;
};

// ✅ CREATE (ADMIN)
export const createProblem = async (data) => {
  const res = await apiClient.post("/problems", data);
  return res.data;
};

// ✅ UPDATE (ADMIN)
export const updateProblem = async (id, data) => {
  const res = await apiClient.put(`/problems/${id}`, data);
  return res.data;
};

// ✅ DELETE (ADMIN)
export const deleteProblem = async (id) => {
  const res = await apiClient.delete(`/problems/${id}`);
  return res.data;
};
