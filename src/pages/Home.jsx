import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/auth.context";
import { Card, FormField, Loader, Navbar } from "../components";

const RenderCards = ({ data, title }) => {
  if (data?.length > 0) {
    return data.map((post) => <Card key={post._id} {...post} />);
  }

  return (
    <h2 className="mt-5 font-bold text-[#6469ff] text-xl uppercase">{title}</h2>
  );
};

const Home = () => {
  const { isLoggedIn, user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [allPosts, setAllPosts] = useState([]);
  const [showMyPosts, setShowMyPosts] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchedResults, setSearchedResults] = useState(null);

  const fetchPosts = async () => {
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5005/api/v1/post", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const result = await response.json();
        setAllPosts(result.data.reverse());
      }
    } catch (err) {
      alert(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    setSearchTimeout(
      setTimeout(() => {
        const searchResult = allPosts.filter(
          (item) =>
            item.name.toLowerCase().includes(searchText.toLowerCase()) ||
            item.prompt.toLowerCase().includes(searchText.toLowerCase())
        );
        setSearchedResults(searchResult);
      }, 500)
    );
  };
  const toggleShowMyPosts = () => {
    setShowMyPosts(!showMyPosts);
  };

  const renderPosts = showMyPosts
    ? allPosts.filter((post) => post.name === user.name)
    : searchedResults || allPosts;

  return (
    <>
      <Navbar />
      <section className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="font-extrabold text-[#222328] text-[32px]">
            The Community Gallery
          </h1>
          <p className="mt-2 text-[#666e75] text-[14px] max-w-[500px] mx-auto">
            Browse through a captivating assortment of captivating artwork,
            fascinating creations, and inspiring contributions from our vibrant
            community.
          </p>
        </div>

        <div className="mt-8 flex justify-between items-end">
          <div className="flex-grow mr-4">
            <FormField
              labelName="Search posts"
              type="text"
              name="text"
              placeholder="Search something..."
              value={searchText}
              handleChange={handleSearchChange}
            />
          </div>

          {isLoggedIn && (
            <div className="flex-shrink-0 ">
              <button
                className="bg-[#6469ff] text-white font-medium py-2 px-4 rounded  hover:bg-blue-700"
                onClick={toggleShowMyPosts}
              >
                {showMyPosts ? "All Posts" : "My Posts"}
              </button>
            </div>
          )}
        </div>

        <div className="mt-10">
          {loading ? (
            <div className="flex justify-center items-center">
              <Loader />
            </div>
          ) : (
            <>
              {searchText && (
                <h2 className="font-medium text-[#666e75] text-xl mb-3">
                  Showing Results for{" "}
                  <span className="text-[#222328]">{searchText}</span>:
                </h2>
              )}
              <div className="grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-3">
                <RenderCards
                  data={renderPosts}
                  title={
                    showMyPosts ? "No Posts Yet" : "No Search Results Found"
                  }
                />
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default Home;
