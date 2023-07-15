import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/auth.context";
import axios from "axios";

function Comment({ comment, onCommentUpdate, onCommentDelete }) {
  const { user, isLoading } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(comment.content);
  const [author, setAuthor] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("authToken");
        console.log(comment.author);
        const response = await axios.get(
          `http://localhost:5005/user/${comment.author}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAuthor(response.data.name); // assuming response.data contains user details
      } catch (error) {
        console.error("Failed to fetch user", error);
      }
    };
    fetchUser();
  }, [comment.author]);

  const handleSave = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5005/api/v1/comments/${comment._id}`,
        {
          content,
        }
      );
      setIsEditing(false);
      onCommentUpdate(response.data);
    } catch (error) {
      console.error("Failed to update comment", error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:5005/api/v1/comments/${comment._id}`
      );
      onCommentDelete(comment._id);
    } catch (error) {
      console.error("Failed to delete comment", error);
    }
  };
  if (isLoading || !author) return <p>Loading...</p>;

  return (
    <div className="p-4 shadow-md rounded-md">
      {isEditing ? (
        <div>
          <textarea
            className="w-full p-2 mb-2 border rounded-md"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button
            className="px-4 py-2 text-white bg-green-500 rounded-md"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      ) : (
        <div>
          <p className="text-lg font-bold">{author}</p>
          <p className="mb-1">{comment.content}</p>
          {user && user.username === comment.author && (
            <div>
              <button
                className="px-4 py-2 mr-2 text-white bg-blue-500 rounded-md"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </button>
              <button
                className="px-4 py-2 text-white bg-red-500 rounded-md"
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
