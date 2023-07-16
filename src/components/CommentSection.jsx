import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../context/auth.context";
const API_URL = process.env.REACT_APP_API_URL;
function CommentSection({ postId, comment = {}, onCommentChange }) {
  const { user } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState(comment.content || "");
  const [content, setContent] = useState("");
  const author = user ? user.username : "";

  const handleEdit = () => setIsEditing(true);

  const handleCommentChange = (event) => {
    setEditedComment(event.target.value);
    if (onCommentChange) {
      onCommentChange({
        ...comment,
        content: editedComment,
        user: comment.author,
      });
    }
  };

  const handleSave = async () => {
    if (comment._id) {
      try {
        await axios.put(`/comments/${comment._id}`, { content: editedComment });
        setIsEditing(false);
        if (onCommentChange) {
          onCommentChange();
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      console.error("Comment does not have an ID");
    }
  };

  const handleDelete = async () => {
    if (comment._id) {
      try {
        await axios.delete(`/comments/${comment._id}`);
        if (onCommentChange) {
          onCommentChange();
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      console.error("Comment does not have an ID");
    }
  };

  const handleNewComment = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/api/v1/comments`, {
        author,
        content,
        postId,
      });

      const newComment = response.data; // Get the newly created comment from the response

      if (onCommentChange) {
        onCommentChange(newComment); // Pass the new comment to the parent component
      }

      setContent("");
    } catch (error) {
      console.error("Failed to create new comment", error);
    }
  };

  useEffect(() => {
    setEditedComment(comment.content || "");
  }, [comment]);

  return (
    <div className="mt-5 space-y-4">
      {isEditing ? (
        <div className="flex items-center">
          <input
            className="border-2 border-gray-300 rounded-md w-full p-2"
            type="text"
            value={editedComment}
            onChange={handleCommentChange}
          />
          {comment._id && (
            <button
              className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleSave}
            >
              Save
            </button>
          )}
        </div>
      ) : (
        <div>
          <p className="text-gray-700">{comment.content || "No content"}</p>
          {comment._id && user && user.username === comment.author && (
            <div className="flex space-x-2">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleEdit}
              >
                Edit
              </button>
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      )}
      <form className="mt-5" onSubmit={handleNewComment}>
        <p className="text-gray-700">{author}</p>
        <input
          className="border-2 border-gray-300 rounded-md w-full p-2"
          type="text"
          placeholder="Content"
          value={content}
          onChange={(event) => setContent(event.target.value)}
        />
        <button
          className="mt-2 w-full bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-4 rounded"
          type="submit"
        >
          Add Comment
        </button>
      </form>
    </div>
  );
}

export default CommentSection;
