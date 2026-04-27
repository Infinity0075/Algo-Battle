import API from "../../../shared/utils/axios";

export const judgeCode = async (data) => {
  const res = await API.post("/judge", data);
  return res.data;
};

export const runCode = judgeCode;
