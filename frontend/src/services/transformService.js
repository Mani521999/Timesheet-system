import axios from 'axios';
const API = 'http://localhost:5000/api';

export const transService = {
    emp: (data) => axios.post(`${API}/transform/employee`, data),
    prod: (data) => axios.post(`${API}/transform/product`, data)
};