import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { Navbar, Card, CommentList } from "../components";
import { AuthContext } from "../context/auth.context";
const API_URL = import.meta.env.VITE_REACT_APP_API_URL;
const ImagePage = () => {
  const { isLoggedIn, user, logOutUser } = useContext(AuthContext);
  const { _id } = useParams();
  const [imageData, setImageData] = useState(null);
  const [comments, setComments] = useState([]);

  // Fetch images by id

  useEffect(() => {
    // Fetch image data and comments by ID
    const fetchImageData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/v1/post/image/${_id}`);
        const data = await response.json();
        // console.log("Data from server:", data);
        setImageData(data);
        // console.log(data); // <-- Add this line
        setComments(data.comments);
      } catch (error) {
        console.error("Failed to fetch image data", error);
      }
    };
    fetchImageData();
  }, [_id]);

  return (
    <div className="max-w-screen-md mx-auto">
      <Navbar />
      <div className="rounded-xl group relative shadow-card hover:shadow-cardhover card inline-block mt-2">
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
      <div className="max-w-screen-md mx-auto">
        <CommentList postId={_id} />
      </div>
    </div>
  );
};

export default ImagePage;
