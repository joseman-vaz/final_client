import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineMenu } from "react-icons/ai";
import logo from "../assets/logo.svg";
import { AuthContext } from "../context/auth.context";

const Navbar = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user, logOutUser } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  // const handleCreatePost = () => {
  //   if (isLoggedIn) {
  //     window.location.href = "/create-post";
  //   } else {
  //     window.location.href = "/login";
  //   }
  // };
  const handleCreatePost = () => {
    if (isLoggedIn) {
      navigate("/create-post");
    } else {
      navigate("/login");
    }
  };

  return (
    <header className="w-full bg-[#f9fafe]">
      <nav className="container mx-auto flex justify-between items-center py-4 px-8">
        <Link to="/">
          <img src={logo} alt="logo" className="w-28 object-contain" />
        </Link>
        <div className="md:hidden">
          <AiOutlineMenu onClick={() => setMenuOpen(!menuOpen)} size={30} />
        </div>
        <ul className="hidden md:flex items-center space-x-4">
          <li>
            <Link to="/" className="text-gray-800 hover:text-blue-600">
              Home
            </Link>
          </li>
          <li>
            <button
              onClick={handleCreatePost}
              className="font-medium bg-[#6469ff] text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Create
            </button>
          </li>
          {isLoggedIn && (
            <>
              {/* <li>
                <Link
                  to="/profile"
                  className="text-gray-800 hover:text-blue-600"
                >
                  Profile
                </Link>
              </li> */}
              <li className="flex items-center space-x-1">
                <button
                  onClick={logOutUser}
                  className="text-gray-800 hover:text-blue-600"
                >
                  Logout
                </button>{" "}
                <span className="text-gray-800 hover:text-blue-600">
                  {user && user.name}
                </span>
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
                  Sign up
                </Link>
              </li>
            </>
          )}
        </ul>
        {menuOpen && (
          <ul className="md:hidden absolute top-16 right-0 z-10 bg-white rounded-lg shadow-md py-2 px-4 space-y-2">
            <li>
              <Link to="/" className="text-gray-800 hover:text-blue-600">
                Home
              </Link>
            </li>
            <li>
              <button
                onClick={handleCreatePost}
                className="font-medium bg-[#6469ff] text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Create
              </button>
            </li>
            {isLoggedIn && (
              <>
                {/* <li>
                  <Link
                    to="/profile"
                    className="text-gray-800 hover:text-blue-600"
                  >
                    Profile
                  </Link>
                </li> */}
                <li className="flex items-center space-x-1">
                  <button
                    onClick={logOutUser}
                    className="text-gray-800 hover:text-blue-600"
                  >
                    Logout
                  </button>{" "}
                  <span className="text-gray-800 hover:text-blue-600">
                    {user && user.name}
                  </span>
                </li>
              </>
            )}
            {!isLoggedIn && (
              <>
                <li>
                  <Link
                    to="/login"
                    className="text-gray-800 hover:text-blue-600"
                  >
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
        )}
      </nav>
    </header>
  );
};

export default Navbar;
