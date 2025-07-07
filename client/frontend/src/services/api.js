import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000', // porta do Flask
});

export default api;
