import API from "../../shared/utils/axios"; // 🔧 USE GLOBAL INSTANCE

// ✅ GET ALL PROBLEMS
export const getProblems = async () => {
  const res = await API.get("/problems");
  return res.data;
};

// ✅ GET SINGLE (slug or id)
export const getProblemById = async (id) => {
  const res = await API.get(`/problems/${id}`);
  return res.data;
};

// ✅ CREATE (ADMIN)
export const createProblem = async (data) => {
  const res = await API.post("/problems", data);
  return res.data;
};

// ✅ UPDATE (ADMIN)
export const updateProblem = async (id, data) => {
  const res = await API.put(`/problems/${id}`, data);
  return res.data;
};

// ✅ DELETE (ADMIN)
export const deleteProblem = async (id) => {
  const res = await API.delete(`/problems/${id}`);
  return res.data;
};
