import { useState } from "react";
import axios from 'axios';
import { useUser } from "../context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

export default function Signin() {
    const navigate = useNavigate();
    const { setUser } = useUser();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function handleSignup() {
        navigate('/signup');
    }

   const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error("Please enter email and password.");
            return;
        }

        const normalizedEmail = email.trim().toLowerCase(); // 👈 normalize email

        try {
            const res = await axios.post(`http://localhost:8000/blog_app/api/login`, {
                email: normalizedEmail,
                password,
            });

            if (res.data && res.data.success) {
                toast.success(res.data.message || "Login successful!");
                localStorage.setItem("user", JSON.stringify({ email: normalizedEmail }));
                setUser({ email: normalizedEmail });
                setTimeout(() => {
                    navigate('/post');
                }, 2000);
            } else {
                toast.error(res.data.message || "Invalid credentials.");
            }
        } catch (error) {
            console.error(error);
            const message = error.response?.data?.message || "Something went wrong. Please try again.";
            toast.error(message);
        }
    };


    return (
        <div className="page pt-[12vh] sm:px-16 px-2 duration-500">
            <div className="h-[85vh] flex flex-col items-center justify-center">
                <h1 className="font-bold mb-8 text-xl flex flex-col items-center">
                    <span>SIGN IN</span>
                    <span className="flex border-2 border-blue-600 mt-1">
                        <span className="blog py-[2px] px-[6px] bg-blue-600 text-white">BLOG</span>
                        <span className="py-[2px] px-[6px] text-blue-600">STUDIO</span>
                    </span>
                </h1>

                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col w-[90%] max-w-[34rem] p-4 shadow-md shadow-black space-y-1 border border-slate-200 bg-slate-50 rounded-md"
                >
                    <div className="flex flex-col">
                        <label className="mb-1 font-medium">Email ID</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="border px-3 h-[2rem] text-[.9rem] outline-none rounded-md bg-white"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="mb-1 font-medium">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="border px-3 h-[2rem] text-[.9rem] outline-none rounded-md bg-white"
                        />
                    </div>

                    <div className="flex justify-end text-sm">
                        <Link to="/forget_password" className="text-blue-600 hover:underline">
                            Forgot Password?
                        </Link>
                    </div>

                    <div className="flex gap-3 justify-between pt-4">
                        <button
                            type="button"
                            onClick={handleSignup}
                            className="w-1/2 border h-[2rem] text-[1.1rem] font-md cursor-pointer rounded-md bg-white hover:bg-slate-200 duration-500"
                        >
                            Sign Up
                        </button>
                        <button
                            type="submit"
                            className="w-1/2 border-blue-600 h-[2rem] text-[1.1rem] font-semibold cursor-pointer rounded-md  bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            Sign In
                        </button>
                    </div>
                </form>
                <Toaster position="bottom-right" reverseOrder={true} />
            </div>
        </div>
    );
}
