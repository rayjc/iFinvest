import { LOCAL_STORAGE_KEY } from '../config';
import LoginApi from '../api/loginApi';


const authenticate = (key = LOCAL_STORAGE_KEY) => {
  return window.localStorage.getItem(key);
};

const login = async (username, password) => {
  const token = await LoginApi.login(username, password);
  window.localStorage.setItem(LOCAL_STORAGE_KEY, token);
};

const logout = () => {
  window.localStorage.removeItem(LOCAL_STORAGE_KEY);
};


export { authenticate, login, logout };