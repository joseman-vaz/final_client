import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { Navbar, CommentSection, Card } from "../components";
import { AuthContext } from "../context/auth.context";

const ImagePage = ({ name = "", prompt, photo }) => {
  const { isLoggedIn, user, logOutUser } = useContext(AuthContext);
  const { _id } = useParams();
  const [imageData, setImageData] = useState(null);
  const [comments, setComments] = useState([]);

  // Fetch images by id

  useEffect(() => {
    // Fetch image data and comments by ID
    const fetchImageData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5005/api/v1/post/image/${_id}`
        );
        const data = await response.json();
        console.log("Data from server:", data);
        setImageData(data);
        console.log(data); // <-- Add this line
        setComments(data.comments);
      } catch (error) {
        console.error("Failed to fetch image data", error);
      }
    };
    fetchImageData();
  }, [_id]);

  const handleCommentChange = () => {
    // Fetch comments again
    const fetchComments = async () => {
      try {
        const response = await fetch(
          `http://localhost:5005/api/v1/post/image/${_id}`
        );
        const data = await response.json();
        setComments(data.comments);
      } catch (error) {
        console.error("Failed to fetch comments", error);
      }
    };
    fetchComments();
  };
  return (
    <div>
      <Navbar />
      <div className="rounded-xl group relative shadow-card hover:shadow-cardhover card inline-block">
        {imageData ? (
          <Card
            _id={_id}
            name={imageData.name}
            prompt={imageData.prompt}
            photo={imageData.imageUrl}
          />
        ) : (
          <div>Loading...</div>
        )}
      </div>
      <div>
        {comments.map((comment) => (
          <div key={comment._id}>
            <p>{comment.author}</p>
            <p>{comment.content}</p>
          </div>
        ))}
      </div>
      <CommentSection postId={_id} onCommentChange={handleCommentChange} />
    </div>
  );
};

export default ImagePage;
