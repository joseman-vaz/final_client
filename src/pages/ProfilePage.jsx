import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/auth.context";

const API_URL = "http://localhost:5005";

function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editedName, setEditedName] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    // Fetch user data from the server
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/user-profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { name, email } = response.data.user;
        setName(name);
        setEmail(email);
        setEditedName(name);
        setEditedEmail(email);
      } catch (error) {
        console.error("Error fetching user profile", error);
      }
    };

    fetchUserData();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      // API call to save the data
      const token = localStorage.getItem("token");
      const requestBody = { name: editedName, email: editedEmail };

      await axios.put(`${API_URL}/user/update`, requestBody, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setName(editedName);
      setEmail(editedEmail);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile", error);
    }
  };

  return (
    <div className="ProfilePage bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96 space-y-4">
        <h1 className="text-2xl font-semibold mb-6 text-center">Profile</h1>

        {!isEditing ? (
          <>
            <div className="space-y-2">
              <div>
                <span className="font-medium text-gray-600">Name: </span>
                <span className="text-gray-800">{name}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Email: </span>
                <span className="text-gray-800">{email}</span>
              </div>
            </div>
            <button
              onClick={handleEdit}
              className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
            >
              Edit
            </button>
          </>
        ) : (
          <>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-600"
                >
                  Name:
                </label>
                <input
                  type="text"
                  name="name"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="mt-1 p-2 w-full border rounded-md"
                />
              </div>
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
                  value={editedEmail}
                  onChange={(e) => setEditedEmail(e.target.value)}
                  className="mt-1 p-2 w-full border rounded-md"
                />
              </div>
            </div>
            <button
              onClick={handleSave}
              className="w-full py-2 px-4 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600"
            >
              Save
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
