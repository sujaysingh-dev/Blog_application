import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ReadPost() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setError("Invalid post ID");
      setLoading(false);
      return;
    }

    async function fetchPost() {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:8000/blog_app/api/readposts/${id}`);
        if (!res.ok) throw new Error(`Failed to fetch post: ${res.statusText}`);
        const data = await res.json();
        setPost(data);
      } catch (err) {
        setError(err.message || "Error fetching post");
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="pt-[12vh] px-4 sm:px-16 min-h-screen bg-white flex justify-center items-center">
        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-[12vh] px-4 sm:px-16 min-h-screen bg-white flex flex-col justify-center items-center">
        <p className="text-red-500 text-lg mb-4">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  const back = () => {
    navigate('/post')
  }

  return (
    <div className="pt-[12vh] px-4 sm:px-16 min-h-screen bg-white max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <p className="text-sm text-gray-600 mb-6 capitalize">{post.category}</p>
      {post.image && (
        <img
          src={`http://localhost:8000${post.image}`}
          alt={post.title}
          className="w-full h-auto rounded mb-6 shadow"
        />
      )}
      <article
        className="prose prose-lg max-w-none mb-4"
        dangerouslySetInnerHTML={{ __html: post.description }}
      ></article>
      <button onClick={back} className="px-4 bg-blue-600 hover:bg-blue-500 text-white duration-500 cursor-pointer rounded-sm mb-4">Back</button>
    </div>
  );
}
