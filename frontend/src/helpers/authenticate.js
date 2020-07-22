const authenticate = (key = "iFinivest-token") => {
  return window.localStorage.getItem(key);
};

export default authenticate;