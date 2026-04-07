import axios from 'axios';
const API = axios.create({ baseURL: 'http://localhost:5000/api' });
export const fetchProjects = () => API.get('/projects');
export const createProject = (data) => API.post('/projects', data);
export const deleteProject = (id) => API.delete(`/projects/${id}`);