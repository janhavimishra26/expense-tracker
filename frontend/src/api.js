import axios from "axios";

const API = axios.create({
    baseURL: "https://expense-tracker-production-51a8.up.railway.app",
});

// FORCE token attach (no interceptor confusion)
API.interceptors.request.use((config) => {

    console.log("➡️ API REQUEST GOING TO:", config.url);

    const token = localStorage.getItem("token");

    console.log("TOKEN SENT:", token);

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default API;