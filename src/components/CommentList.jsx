import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import AddComment from "./AddComment";
import Comment from "./Comment";
const API_URL = process.env.REACT_APP_API_URL;
function CommentList({ postId }) {
  const [comments, setComments] = useState([]);
  const [displayLimit, setDisplayLimit] = useState(3);
  const [showMore, setShowMore] = useState(false);

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

  const handleSeeMore = () => {
    if (showMore) {
      setDisplayLimit(3);
    } else {
      setDisplayLimit(comments.length);
    }
    setShowMore(!showMore);
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/v1/post/image/${postId}`
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
      {comments.slice(0, displayLimit).map((comment) => (
        <Comment
          key={comment._id}
          comment={comment}
          onCommentUpdate={handleCommentUpdate}
          onCommentDelete={handleCommentDelete}
        />
      ))}
      {comments.length > 3 && (
        <button
          className="mt-2 px-4 py-2 text-white bg-[#6469ff] rounded-md hover:bg-blue-700 mx-auto block"
          onClick={handleSeeMore}
        >
          {showMore ? "Hide Comments" : "See More Comments"}
        </button>
      )}
    </div>
  );
}

export default CommentList;
