import React from "react";
import Comment from "./Comment";

const CommentsList = ({ comments, onEditComment, onDeleteComment }) => (
  <div>
    {comments && comments.length > 0 ? (
      comments.map((comment) => (
        <Comment
          key={comment._id}
          _id={comment._id}
          user={comment.user}
          comment={comment.comment}
          onEdit={onEditComment}
          onDelete={onDeleteComment}
        />
      ))
    ) : (
      <p>No comments yet.</p>
    )}
  </div>
);

export default CommentsList;
