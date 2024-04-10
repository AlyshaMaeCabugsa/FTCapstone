// authUtils.js
import { jwtDecode } from 'jwt-decode';

export const isTokenExpired = token => {
  try {
    const decodedToken = jwtDecode(token);
    return decodedToken.exp < Date.now() / 1000;
  } catch (e) {
    return true; // If there's an error decoding, assume it's expired
  }
};

export const checkIsLoggedIn = () => {
  const token = localStorage.getItem("token");
  const loggedIn = localStorage.getItem("loggedIn") === "true";
  return loggedIn && token && !isTokenExpired(token);
};
