const isLoggedIn = () => {
  return !!localStorage.getItem("fspToken");
};
export { isLoggedIn };
