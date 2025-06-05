import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Blog() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get("http://localhost:8000/blog_app/api/publicBlog");
        setBlogs(res.data);
        setFilteredBlogs(res.data);

        // Extract unique categories
        const cats = ["All", ...new Set(res.data.map(blog => blog.category))];
        setCategories(cats);
      } catch (err) {
        console.error("Failed to fetch blogs:", err);
      }
    };

    fetchBlogs();
  }, []);

  // Handle category selection
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (category === "All") {
      setFilteredBlogs(blogs);
    } else {
      const filtered = blogs.filter(blog => blog.category === category);
      setFilteredBlogs(filtered);
    }
  };

  // Navigate to blog read more page with ID
  const readmore = (id) => {
    navigate(`/public_read_more/${id}`);
  };

  return (
    <div className="page pt-[12vh] sm:px-16 px-4 duration-500">
      <h1 className="text-2xl mb-6 font-semibold">Public Blog</h1>

      {/* Category Filter Buttons */}
      <div className="flex gap-1 flex-wrap mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`px-4 py-1 rounded-full text-[10px] border capitalize cursor-pointer ${
              selectedCategory === cat
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Blog Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredBlogs.map((blog) => (
          <div
            key={blog._id}
            className="bg-white shadow-md rounded-2xl overflow-hidden transition-transform hover:scale-[1.02]"
          >
            {blog.image && (
              <img
                src={`http://localhost:8000${blog.image}`}
                alt={blog.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h2 className="text-md font-semibold capitalize">{blog.title}</h2>
              <p className="text-sm -mt-2 mb-2 capitalize text-gray-600">
                {blog.category}
              </p>

              {blog.description && (
                <div
                  className="text-gray-600 mb-3"
                  dangerouslySetInnerHTML={{
                    __html: blog.excerpt || blog.description.slice(0, 100) + "...",
                  }}
                />
              )}

              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500 capitalize">
                  By {blog.author?.firstName} {blog.author?.lastName}
                </p>
                <button
                  onClick={() => readmore(blog._id)}
                  className="text-sm bg-blue-600 text-white hover:bg-blue-700 duration-500 px-2 pb-[2px] rounded-sm cursor-pointer"
                >
                  Read more
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
