const RAW_API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const NORMALIZED_API_BASE_URL = RAW_API_BASE_URL.replace(/\/+$/, "");
const API_ORIGIN = NORMALIZED_API_BASE_URL.endsWith("/api")
  ? NORMALIZED_API_BASE_URL.slice(0, -4)
  : NORMALIZED_API_BASE_URL;

export const API_BASE_URL = `${API_ORIGIN}/api`;

