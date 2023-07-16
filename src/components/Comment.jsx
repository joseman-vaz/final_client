import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/auth.context";
import axios from "axios";

function Comment({ comment, onCommentUpdate, onCommentDelete }) {
  const { user /*isLoading*/ } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(comment.content);
  const [author, setAuthor] = useState("");
  const API_URL = process.env.REACT_APP_API_URL;
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("authToken");
        console.log(comment.author);
        const response = await axios.get(`${API_URL}/user/${comment.author}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAuthor(response.data.name); // assuming response.data contains user details
      } catch (error) {
        console.error("Failed to fetch user", error);
      }
    };
    fetchUser();
  }, [comment.author]);

  const handleSave = async () => {
    try {
      const requestBody = { author: user._id, content };
      const authToken = localStorage.getItem("authToken");
      const response = await axios.put(
        `${API_URL}/api/v1/comments/${comment._id}`,
        requestBody,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      setIsEditing(false);
      onCommentUpdate(response.data);
    } catch (error) {
      console.error("Failed to update comment", error);
    }
  };

  const handleDelete = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      await axios.delete(`${API_URL}/api/v1/comments/${comment._id}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      onCommentDelete(comment._id);
    } catch (error) {
      console.error("Failed to delete comment", error);
    }
  };
  // if (/*isLoading ||*/ !author) return <p>Loading...</p>;
  const numberOfLines = content.split("\n").length;

  return (
    <div className="p-4 shadow-md rounded-md">
      {isEditing ? (
        <div>
          <textarea
            className="w-full p-2 mb-2 border rounded-md"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={numberOfLines}
          />
          <button
            className="px-2 py-1 text-white bg-green-500 rounded-md" // reduce px-4 to px-2 and py-2 to py-1
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      ) : (
        <div className="flex items-center space-x-4">
          <p className="text-lg font-bold">{author}</p>
          <p className="overflow-wrap-anywhere">{comment.content}</p>
          {user && user._id === comment.author && (
            <div className="flex">
              <button
                className="px-2 py-1 mr-2 text-white bg-[#6469ff] rounded-md hover:bg-blue-700" // reduce px-4 to px-2 and py-2 to py-1
                onClick={() => setIsEditing(true)}
              >
                Edit
              </button>
              <button
                className="px-2 py-1 text-white bg-red-400 rounded-md hover:bg-red-500" // reduce px-4 to px-2 and py-2 to py-1
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Comment;
