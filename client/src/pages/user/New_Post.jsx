import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TextEditor from '../../component/TextEdtor';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

export default function NewPost() {
    const navigate = useNavigate();
    const [category, setCategory] = useState('');
    const [title, setTitle] = useState('');
    const [tags, setTags] = useState('');
    const [published, setPublished] = useState(false);
    const [image, setImage] = useState(null);
    const [content, setContent] = useState('');
    const [author, setAuthor] = useState('');

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            if (parsedUser.email) {
                setAuthor(parsedUser.email);
            }
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!category || !title || !content) {
            toast.error("Category, Title, Content fields are required!");
            return;
        }

        const formData = new FormData();
        formData.append('category', category);
        formData.append('title', title);
        formData.append('content', content);
        formData.append('published', published);
        formData.append('author', author);
        if (tags) formData.append('tags', tags);
        if (image) formData.append('image', image);

        try {
            const res = await axios.post(
                `http://localhost:8000/blog_app/api/post_blog`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    withCredentials: true,
                }
            );

            if (res.data.success) {
                toast.success(res.data.message);
                setTimeout(() => {
                    navigate('/post');
                }, 2000);
            } else {
                toast.error(res.data.message || "Post submission failed.");
            }
        } catch (error) {
            toast.error("An error occurred while submitting the blog.");
            console.error("Error during blog post submission:", error);
        }
    };

    return (
        <div className="pt-[12vh] px-4 sm:px-16 min-h-screen bg-white duration-500">
            <h1 className="text-2xl font-semibold mb-6">New Post</h1>
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
                        className="px-5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition duration-300"
                    >
                        Save
                    </button>
                </div>
            </form>
            <Toaster position="bottom-right" reverseOrder={false} />
        </div>
    );
}
