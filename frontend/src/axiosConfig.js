import axios from 'axios';

const nodeApi = axios.create({
  baseURL: 'http://localhost:8000',
});

export default nodeApi;