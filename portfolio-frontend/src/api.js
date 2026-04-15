import axios from 'axios';
const API = axios.create({ baseURL: 'http://localhost:5005/api' });

API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});
export const fetchProjects = () => API.get('/projects');
export const createProject = (data) => API.post('/projects', data);
export const deleteProject = (id) => API.delete(`/projects/${id}`);
export const updateProject = (id, data) => API.put(`/projects/${id}`, data);

export const authRegister = (data) => API.post('/auth/register', data);
export const authLogin = (data) => API.post('/auth/login', data);

export const fetchProjectStats = () => API.get('/projects/stats');
export const fetchSkills = () => API.get('/skills');
export const addSkill = (data) => API.post('/skills', data);
