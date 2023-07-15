import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import AddComment from "./AddComment";
import Comment from "./Comment";

function CommentList({ postId }) {
  const [comments, setComments] = useState([]);

  const handleCommentSubmit = (newComment) => {
    setComments((prevComments) => [newComment, ...prevComments]);
  };

  const handleCommentUpdate = (updatedComment) => {
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment._id === updatedComment._id ? updatedComment : comment
      )
    );
  };

  const handleCommentDelete = (commentIdToDelete) => {
    setComments((prevComments) =>
      prevComments.filter((comment) => comment._id !== commentIdToDelete)
    );
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5005/api/v1/post/image/${postId}`
        );
        // console.log(response.data);
        setComments(response.data.comments);
      } catch (error) {
        console.error(error);
      }
    };
    fetchComments();
  }, [postId]);

  return (
    <div>
      <AddComment postId={postId} onCommentSubmit={handleCommentSubmit} />
      {comments.map((comment) => (
        <Comment
          key={comment._id}
          comment={comment}
          onCommentUpdate={handleCommentUpdate}
          onCommentDelete={handleCommentDelete}
        />
      ))}
    </div>
  );
}

export default CommentList;
