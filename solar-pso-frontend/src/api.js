import axios from "axios";

const BASE_URL = "http://localhost:8000";

export const uploadDataset = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return axios.post(`${BASE_URL}/upload`, formData);
};

export const optimizeSites = (payload) => {
  return axios.post(`${BASE_URL}/optimize`, payload);
};

export const downloadCSV = (downloadUrl) => {
  window.open(`${BASE_URL}${downloadUrl}`, "_blank");
};
