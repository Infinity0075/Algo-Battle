import apiClient from "../../../shared/api/apiClient";

export const judgeCode = async (data) => {
  const res = await apiClient.post("/judge", data);
  return res.data;
};

export const runCode = judgeCode;
