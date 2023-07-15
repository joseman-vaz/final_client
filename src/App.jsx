import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  Home,
  CreatePost,
  SignupPage,
  LoginPage,
  ProfilePage,
  ImagePage,
} from "./pages/index.js";

const App = () => {
  return (
    <BrowserRouter>
      <main className="sm:p-8 px-4 py-8 w-full bg-[#f9fafe] min-h-[calc(100vh-73px)]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/update" element={<ProfilePage />} />
          <Route path="/image/:_id" element={<ImagePage />} />
          <Route path="/comments/:_id" element={<ImagePage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
};

export default App;
