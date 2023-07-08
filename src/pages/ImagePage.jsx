import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Navbar, CommentsList } from "../components";

const ImagePage = () => {
  const { _id } = useParams();
  const [imageData, setImageData] = useState(null);
  const [comments, setComments] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [newComment, setNewComment] = useState("");

  // Fetch images by id
  useEffect(() => {
    fetch(`http://localhost:5005/api/v1/post/image/${_id}`)
      .then((response) => response.json())
      .then((data) => {
        setImageData(data);
      });
  }, [_id]);

  // Fetch comments
  useEffect(() => {
    fetch(`http://localhost:5005/api/v1/comments/${_id}`)
      .then((response) => response.json())
      .then((data) => setComments(data.comments))
      .catch((error) => {
        console.error("Failed to fetch comments:", error);
      });
  }, [_id]);

  // Fetch user information
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userInfo = await getUserInfo();
        setCurrentUser(userInfo);
      } catch (error) {
        console.error("Failed to fetch user information:", error);
      }
    };

    fetchUserInfo();
  }, []);

  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!newComment || !currentUser) {
      return;
    }

    try {
      const response = await fetch("http://localhost:5005/api/v1/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId: _id,
          author: currentUser.name,
          content: newComment,
        }),
      });

      if (!response.ok) {
        console.error("Failed to add comment");
        return;
      }

      const data = await response.json();

      // Add the newly created comment to the local state
      setComments((prevComments) => [...prevComments, data.comment]);

      // Clear the comment input field
      setNewComment("");
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  const handleEditComment = async (commentId) => {
    const newComment = prompt("Enter new comment"); // Get the new comment. You might want to use a form in production.

    const response = await fetch(
      `http://localhost:5005/api/v1/comments/${commentId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment: newComment }),
      }
    );

    if (!response.ok) {
      console.error("Failed to edit comment");
      return;
    }

    const updatedComment = await response.json();

    // Updates the comment in the local state
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment._id === updatedComment._id ? updatedComment : comment
      )
    );
  };

  const handleDeleteComment = async (commentId) => {
    const response = await fetch(
      `http://localhost:5005/api/v1/comments/${commentId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      console.error("Failed to delete comment");
      return;
    }

    // Removes the deleted comment from the local state
    setComments((prevComments) =>
      prevComments.filter((comment) => comment._id !== commentId)
    );
  };

  return (
    <div>
      <Navbar />
      {imageData && (
        <>
          <img src={imageData.imageUrl} alt={imageData.prompt} />
          <h1>{imageData.name}</h1>
          <p>{imageData.prompt}</p>
        </>
      )}
      <form onSubmit={handleAddComment}>
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
        />
        <button type="submit">Add Comment</button>
      </form>
      <CommentsList
        comments={comments}
        onEditComment={handleEditComment}
        onDeleteComment={handleDeleteComment}
      />
    </div>
  );
};

export default ImagePage;
