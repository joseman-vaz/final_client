// src/context/auth.context.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_REACT_APP_API_URL;
const AuthContext = React.createContext();

function AuthProviderWrapper(props) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  /* 
    Functions for handling the authentication status (isLoggedIn, isLoading, user)
    will be added here later in the next step
  */
  const login = (userData) => {
    // Update the user state with the logged in user's data
    setUser(userData);
  };

  const logout = () => {
    // Clear the user state
    setUser(null);
  };

  const storeToken = (token) => {
    //  <==  ADD
    localStorage.setItem("authToken", token);
    console.log("Stored token: ", token);
  };

  const removeToken = () => {
    // Upon logout, remove the token from the localStorage
    localStorage.removeItem("authToken");
  };

  const logOutUser = () => {
    // <== ADD
    // To log out the user, remove the token
    removeToken();
    // and update the state variables
    authenticateUser();
    // rejectLogIn();
  };
  const acceptLogIn = (user) => {
    setIsLoggedIn(true);
    setIsLoading(false);
    setUser(user);
  };
  const rejectLogIn = () => {
    setIsLoggedIn(false);
    setIsLoading(false);
    setUser(null);
  };

  const authenticateUser = () => {
    //  <==  ADD
    // Get the stored token from the localStorage
    const storedToken = localStorage.getItem("authToken");

    // If the token exists in the localStorage
    if (storedToken) {
      // We must send the JWT token in the request's "Authorization" Headers
      axios
        .get(`${API_URL}/auth/verify`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        })
        .then((response) => {
          acceptLogIn(response.data);
        })
        .catch((error) => {
          rejectLogIn();
        });
    } else {
      rejectLogIn();
    }
  };

  useEffect(() => {
    authenticateUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        isLoggedIn,
        isLoading,
        user,
        storeToken,
        authenticateUser,
        logOutUser,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

export { AuthProviderWrapper, AuthContext };
