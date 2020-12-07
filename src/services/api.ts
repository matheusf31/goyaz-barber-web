import axios from 'axios'

const api = axios.create({
  baseURL: 'https://goyazbarber.tecteu.com'
});

export default api;