// src/pages/LoginPage.js

import { useState, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import { Navbar } from "../components";

const API_URL = "http://localhost:5005";

function LoginPage(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);
  const { storeToken, authenticateUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleEmail = (e) => setEmail(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const requestBody = { email, password };

    axios
      .post(`${API_URL}/auth/login`, requestBody)
      .then((response) => {
        // Request to the server's endpoint `/auth/login` returns a response
        // with the JWT string ->  response.data.authToken
        console.log("JWT token", response.data.authToken);
        storeToken(response.data.authToken);
        authenticateUser();
        navigate("/"); // <== ADD
      })
      .catch((error) => {
        const errorDescription = error.response.data.message;
        setErrorMessage(errorDescription);
      });
  };

  return (
    <>
      <Navbar />
      <div className="LoginPage bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <h1 className="text-2xl font-semibold mb-6 text-center">Login</h1>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-600"
              >
                Email:
              </label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={handleEmail}
                className="mt-1 p-2 w-full border rounded-md"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-600"
              >
                Password:
              </label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={handlePassword}
                className="mt-1 p-2 w-full border rounded-md"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
            >
              Login
            </button>
          </form>

          {errorMessage && (
            <p className="error-message mt-4 text-center text-red-600">
              {errorMessage}
            </p>
          )}

          <p className="mt-4 text-center text-sm text-gray-600">
            Don't have an account yet?{" "}
            <Link
              to={"/signup"}
              className="font-medium text-blue-500 hover:text-blue-600"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
