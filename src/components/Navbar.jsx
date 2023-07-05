import React, { useContext } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.svg";
import { AuthContext } from "../context/auth.context";

const Navbar = () => {
  const { isLoggedIn, user, logOutUser } = useContext(AuthContext);
  return (
    <header className="w-full bg-white border-b border-b-[#e6ebf4]">
      <nav className="container mx-auto flex justify-between items-center py-4 px-8">
        <Link to="/">
          <img src={logo} alt="logo" className="w-28 object-contain" />
        </Link>
        <ul className="flex items-center space-x-4">
          <li>
            <Link to="/" className="text-gray-800 hover:text-blue-600">
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/create-post"
              className="font-medium bg-[#6469ff] text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Create
            </Link>
          </li>
          {isLoggedIn && (
            <>
              {" "}
              <li>
                <Link
                  to="/user-profile"
                  className="text-gray-800 hover:text-blue-600"
                >
                  Profile
                </Link>
              </li>
              <li>
                <button
                  onClick={logOutUser}
                  className="text-gray-800 hover:text-blue-600"
                >
                  Logout
                </button>
                <span> {user && user.name}</span>
              </li>
            </>
          )}
          {!isLoggedIn && (
            <>
              <li>
                <Link to="/login" className="text-gray-800 hover:text-blue-600">
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/signup"
                  className="text-gray-800 hover:text-blue-600"
                >
                  Signup
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
