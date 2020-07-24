import { LOCAL_STORAGE_KEY } from '../config';


const authenticate = (key = LOCAL_STORAGE_KEY) => {
  return window.localStorage.getItem(key);
};

const login = async (token) => {
  window.localStorage.setItem(LOCAL_STORAGE_KEY, token);
};

const logout = () => {
  window.localStorage.removeItem(LOCAL_STORAGE_KEY);
};


export { authenticate, login, logout };