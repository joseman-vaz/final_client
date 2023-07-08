import React from "react";

const Comment = ({ _id, comment, onEdit, onDelete }) => (
  <div className="flex items-center space-x-4">
    <p>
      <strong>{comment.author}</strong>: {comment.content}
    </p>
    <button
      onClick={() => onEdit(_id)}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      Edit
    </button>
    <button
      onClick={() => onDelete(_id)}
      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
    >
      Delete
    </button>
  </div>
);

export default Comment;
