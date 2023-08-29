
import axios from '../utils/axios';

export const logout = () => {
  sessionStorage.removeItem('access_token');
  window.location.reload();
}


export const getProfile = () => {
  return axios.get("/users/profile")
}