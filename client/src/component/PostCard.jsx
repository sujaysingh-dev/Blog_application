import { useState, useEffect, useRef } from "react";
import { BiLike, BiDislike } from "react-icons/bi";
import { MdEdit } from "react-icons/md";
import { IoShareSocialSharp } from "react-icons/io5";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function PostCard({ post }) {
  const navigate = useNavigate();
  const postId = post._id;
  const [showShare, setShowShare] = useState(false);
  const shareRef = useRef(null);

  const edit = () => {
    navigate(`/editPost/${postId}`);
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      const res = await fetch(`http://localhost:8000/blog_app/api/posts/${postId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete post");
      alert("Post deleted successfully");
      window.location.reload();
    } catch (error) {
      alert("Error deleting post");
      console.error(error);
    }
  };

  const postUrl = encodeURIComponent(`http://localhost:3000/post/${postId}`);
  const postTitle = encodeURIComponent(post.title);

  const openShareWindow = (url) => {
    window.open(url, "ShareWindow", "width=600,height=400,scrollbars=no,resizable=no");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (shareRef.current && !shareRef.current.contains(event.target)) {
        setShowShare(false);
      }
    };
    if (showShare) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showShare]);

  const readPost = () => {
    navigate(`/readPost/${postId}`);
  };

  return (
    <div className="bg-gray-100 shadow-md rounded-md p-4 flex flex-col sm:flex-row gap-4 relative mb-6">

      {/* Image */}
      <div className="w-full sm:w-64 h-48 bg-white border rounded-md overflow-hidden flex-shrink-0">
        {post.image ? (
          <img
            src={`http://localhost:8000${post.image}`}
            alt="Post Cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            No Image
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow">
        <h2 className="text-xl sm:text-2xl font-semibold">{post.title}</h2>
        <span className="text-xs text-gray-600 mb-2 capitalize">{post.category}</span>
        <div
          className="text-sm text-justify text-gray-700 line-clamp-4"
          dangerouslySetInnerHTML={{ __html: post.description }}
        ></div>

        {/* Actions */}
        <div className="flex items-center gap-4 mt-4">
          <BiLike className="cursor-pointer hover:text-blue-600 text-xl" />
          <BiDislike className="cursor-pointer hover:text-red-600 text-xl" />
            <button
                onClick={readPost}
                className="bg-blue-600 hover:bg-blue-700 text-white text-[12px] px-4 py-1 rounded transition cursor-pointer"
            >
                Read more
            </button>
            <div
                className={`text-[12px] px-4 py-1 rounded transition cursor-pointer ${
                post.published
                    ? "bg-green-600 text-white"
                    : "bg-red-600 text-white"
                }`}
            >
                {post.published ? "Published" : "Not Published"}
            </div>
        </div>
      </div>

      {/* Edit/Share/Delete */}
      <div className="absolute top-4 right-4 flex gap-2">
        <MdEdit
          onClick={edit}
          className="text-white p-1 bg-green-500 rounded cursor-pointer text-xl hover:scale-105"
        />

        <div className="relative" ref={shareRef}>
          <IoShareSocialSharp
            onClick={() => setShowShare(!showShare)}
            className="text-white p-1 bg-blue-600 rounded cursor-pointer text-xl hover:scale-105"
          />

          {showShare && (
            <div className="absolute right-0 mt-2 bg-white rounded items-start shadow-lg p-2 flex flex-col gap-2 z-10">
              <button
                onClick={() =>
                  openShareWindow(`https://www.facebook.com/sharer/sharer.php?u=${postUrl}`)
                }
                className="text-blue-600 hover:underline"
              >
                Facebook
              </button>
              <button
                onClick={() =>
                  openShareWindow(`https://twitter.com/intent/tweet?url=${postUrl}&text=${postTitle}`)
                }
                className="text-blue-400 hover:underline"
              >
                Twitter
              </button>
              <button
                onClick={() =>
                  openShareWindow(
                    `https://www.linkedin.com/shareArticle?mini=true&url=${postUrl}&title=${postTitle}`
                  )
                }
                className="text-blue-700 hover:underline"
              >
                LinkedIn
              </button>
            </div>
          )}
        </div>

        <FaTrash
          onClick={handleDelete}
          className="text-white p-1 bg-red-600 rounded cursor-pointer text-xl hover:scale-105"
        />
      </div>
    </div>
  );
}
