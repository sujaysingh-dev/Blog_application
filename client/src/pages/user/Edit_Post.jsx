import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import TextEditor from "../../component/TextEdtor"; // Make sure this file exists and is correctly spelled
import { Toaster, toast } from "react-hot-toast";


export default function EditPost() {
    const navigate = useNavigate();
    const { id } = useParams();

    // State declarations
    const [category, setCategory] = useState("");
    const [title, setTitle] = useState("");
    const [image, setImage] = useState(null);
    const [tags, setTags] = useState("");
    const [published, setPublished] = useState(false);
    const [content, setContent] = useState("");

    // Load post data on mount
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await fetch(`http://localhost:8000/blog_app/api/posts/${id}`);
                if (!res.ok) throw new Error("Post not found");
                const data = await res.json();

                // Populate form fields
                setCategory(data.category || "");
                setTitle(data.title || "");
                setTags(data.tags?.join(", ") || "");
                setPublished(data.published || false);
                setContent(data.description || "");
            } catch (err) {
                toast.error("Failed to load post");
                console.error("Fetch error:", err);
            }
        };

        fetchPost();
    }, [id]);

    // Submit handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("category", category);
        formData.append("title", title);
        formData.append("tags", tags);
        formData.append("published", published);
        formData.append("description", content);
        if (image) formData.append("image", image);

        try {
            const res = await fetch(`http://localhost:8000/blog_app/api/posts/${id}`, {
                method: "PUT",
                body: formData
                // No headers here — let browser set multipart/form-data
            });

            if (!res.ok) throw new Error("Failed to update post");

            toast.success("Post updated successfully");
            setTimeout(() => {
                navigate('/post');
            }, 2000);
        } catch (err) {
            toast.error("Error updating post");
            console.error("Update error:", err);
        }
    };

    return (
        <div className="pt-[12vh] px-4 sm:px-16 min-h-screen bg-white duration-500">
            <h1 className="text-2xl font-semibold mb-6">Edit Post</h1>
            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                {/* Category, Title, Image */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex flex-col">
                        <label className="font-semibold mb-1">Category *</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="h-[2rem] border border-gray-300 px-2 text-sm outline-none rounded-md"
                        >
                            <option value="">Select category</option>
                            <option value="entertainment">Entertainment</option>
                            <option value="personal">Personal</option>
                            <option value="professional">Professional</option>
                            <option value="business">Business/Corporate</option>
                            <option value="niche">Niche</option>
                            <option value="affiliate">Affiliate</option>
                            <option value="news">News</option>
                            <option value="lifestyle">Lifestyle</option>
                            <option value="fashion">Fashion</option>
                            <option value="travel">Travel</option>
                            <option value="food">Food</option>
                            <option value="health and fitness">Health and Fitness</option>
                            <option value="tech">Tech</option>
                            <option value="educational">Educational</option>
                            <option value="finance investment">Finance/Investment</option>
                            <option value="diy craft">DIY/Craft</option>
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <label className="font-semibold mb-1">Title *</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="h-[2rem] border border-gray-300 px-3 text-sm rounded-md outline-none"
                            placeholder="Enter post title"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="font-semibold mb-1">Image</label>
                        <input
                            type="file"
                            onChange={(e) => setImage(e.target.files[0])}
                            accept="image/*"
                            className="h-[2rem] border border-gray-300 px-3 text-sm rounded-md outline-none pt-1 cursor-pointer"
                        />
                    </div>
                </div>

                {/* Tags and Published */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex flex-col">
                        <label className="font-semibold mb-1">Tags (comma separated)</label>
                        <input
                            type="text"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            className="h-[2rem] border border-gray-300 px-3 text-sm rounded-md outline-none"
                            placeholder="e.g., ai, machine learning, future"
                        />
                    </div>

                    <div className="flex flex-col items-start justify-end pt-5">
                        <label className="flex gap-2 text-sm cursor-pointer">
                            <input
                                type="checkbox"
                                checked={published}
                                onChange={() => setPublished(!published)}
                            />
                            Publish immediately
                        </label>
                    </div>
                </div>

                {/* Description */}
                <div className="flex flex-col">
                    <label className="font-semibold mb-1">Description *</label>
                    <TextEditor value={content} onChange={setContent} />
                </div>

                {/* Buttons */}
                <div className="flex justify-end mt-4 gap-3">
                    <button
                        type="submit"
                        className="px-5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition duration-300 cursor-pointer"
                    >
                        Update Post
                    </button>
                </div>
            </form>
            <Toaster position="bottom-right" reverseOrder={false} />
        </div>
    );
}
