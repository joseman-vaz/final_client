import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/auth.context";
import axios from "axios";

function AddComment({ postId, onCommentSubmit }) {
  const { user, authenticateUser } = useContext(AuthContext);
  const [content, setContent] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const requestBody = { author: user._id, content, postId };
      const authToken = localStorage.getItem("authToken");
      const response = await axios.post(
        "http://localhost:5005/api/v1/comments",
        requestBody,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      const newComment = response.data;
      // newComment.author = response.data.author._id;
      console.log(newComment);
      onCommentSubmit(newComment);
      setContent("");
    } catch (error) {
      console.error("Failed to create new comment", error);
    }
  };

  return (
    <form className="p-4 shadow-md rounded-md" onSubmit={handleSubmit}>
      <textarea
        className="w-full p-2 mb-2 border rounded-md"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button
        className="px-4 py-2 text-white bg-[#6469ff] rounded-md hover:bg-blue-700"
        type="submit"
      >
        Add Comment
      </button>
    </form>
  );
}

export default AddComment;
