export const API_URL = import.meta.env.VITE_BACKEND_URL;

export const getToken = () => sessionStorage.getItem("token");

export const getServerMessage = (data, fallback) =>
    data?.msg || data?.error || data?.message || fallback;

export const logout = () => sessionStorage.removeItem("token");
