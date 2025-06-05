import { useEffect, useState } from "react";
import axios from "axios";
import PostCard from "../../component/PostCard.jsx"; // Confirm path is correct

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      const user = localStorage.getItem('user');
      const email = user ? JSON.parse(user).email : null;

      if (!email) {
        setError("User email not found in localStorage. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get("http://localhost:8000/blog_app/api/all_blogs", {
          params: { email },
          withCredentials: true,
        });

        if (res.data.success) {
          setPosts(res.data.blogs || []);
          setError("");
        } else {
          setError("Failed to load posts.");
          setPosts([]);
        }
      } catch (err) {
        console.error("Failed to fetch posts:", err);
        setError("Error fetching posts. Please try again later.");
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="pt-[12vh] px-4 sm:px-16 min-h-screen bg-white">
      <h1 className="text-2xl font-semibold mb-6">All Posts</h1>

      {loading && <p className="text-gray-600">Loading posts...</p>}

      {!loading && error && (
        <p className="text-red-600">{error}</p>
      )}

      {!loading && !error && posts.length === 0 && (
        <p className="text-gray-600">No posts available.</p>
      )}

      {!loading && !error && posts.length > 0 && (
        posts.map((post) => (
          <PostCard key={post._id || post.id} post={post} />
        ))
      )}
    </div>
  );
}
