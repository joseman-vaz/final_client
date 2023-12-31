import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import preview from "../assets/preview.png";
import { getRandomPrompt } from "../utils";
import { FormField, Loader, Navbar, Footer } from "../components";
import { AuthContext } from "../context/auth.context";
const API_URL = import.meta.env.VITE_REACT_APP_API_URL;
const CreatePost = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [form, setForm] = useState({
    // name: "",
    prompt: "",
    photo: "",
  });

  const [generatingImg, setGeneratingImg] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSurpriseMe = () => {
    const randomPrompt = getRandomPrompt(form.prompt);
    setForm({ ...form, prompt: randomPrompt });
  };

  const generateImage = async () => {
    if (form.prompt) {
      try {
        setGeneratingImg(true);
        const token = localStorage.getItem("authToken");
        const response = await fetch(`${API_URL}/api/v1/dalle`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            prompt: form.prompt,
          }),
        });
        if (!response.ok) {
          // handle non-OK responses here
          console.error("Server responded with", response.status);
          const errorData = await response.json();
          console.error(errorData);
          return;
        }
        const data = await response.json();
        setForm({ ...form, photo: `data:image/jpeg;base64,${data.photo}` });
      } catch (err) {
        alert(err);
      } finally {
        setGeneratingImg(false);
      }
    } else {
      alert("Please provide proper prompt");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.prompt && form.photo) {
      setLoading(true);
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(`${API_URL}/api/v1/post`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...form,
            name: user.name,
          }),
        });

        await response.json();
        // alert("Success");
        navigate("/");
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    } else {
      alert("Please generate an image with proper details");
    }
  };

  return (
    <div className="max-w-screen-md mx-auto">
      <Navbar />

      <section className="mx-auto mt-4">
        <div>
          <h1 className="font-extrabold text-[#222328] text-[32px] text-center">
            Create your masterpiece
          </h1>
          <p className="mt-2 text-[#666e75] text-[14px] max-w-[500px] text-center">
            Let your imagination run wild and create your own masterpiece with
            the help of AI.
          </p>
        </div>

        <form className="mt-10 px-4 sm:px-0" onSubmit={handleSubmit}>
          <div className="imageCreator flex flex-col gap-5">
            <FormField
              labelName="Prompt"
              type="text"
              name="prompt"
              placeholder="An Impressionist oil painting of sunflowers in a purple vase…"
              value={form.prompt}
              handleChange={handleChange}
              isSurpriseMe
              handleSurpriseMe={handleSurpriseMe}
            />

            <div className="relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-96 max-w-full h-96 max-h-full p-3 flex justify-center mx-auto items-center">
              {form.photo ? (
                <img
                  src={form.photo}
                  alt={form.prompt}
                  className="w-full h-full object-contain"
                />
              ) : (
                <img
                  src={preview}
                  alt="preview"
                  className="w-full h-full object-contain opacity-40"
                />
              )}

              {generatingImg && (
                <div className="absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg">
                  <Loader />
                </div>
              )}
            </div>
          </div>

          <div className="mt-5 flex flex-col sm:flex-row justify-between gap-5">
            <button
              type="button"
              onClick={generateImage}
              className="text-white bg-green-700 font-medium rounded-md text-sm w-full sm:w-auto px-2 py-2.5 text-center hover:bg-green-800"
            >
              {generatingImg ? "Generating..." : "Generate"}
            </button>

            <button
              type="submit"
              className="mt-2 sm:mt-0 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-2 py-2.5 text-center hover:bg-blue-700"
            >
              {loading ? "Sharing..." : "Share with the Community"}
            </button>
          </div>

          <p className="mt-3 text-[#666e75] text-[14px] text-center">
            ** Once you have created the image you want, you can share it with
            others in the community **
          </p>
        </form>
      </section>

      <Footer />
    </div>
  );
};

export default CreatePost;
