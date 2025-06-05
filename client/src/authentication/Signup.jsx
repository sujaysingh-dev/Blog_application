import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function Signup() {
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmpassword, setConfirmPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate required fields
        if (!firstName || !lastName || !email || !password || !confirmpassword) {
            toast.error("Please fill in all fields.");
            return;
        }

        // Validate password match
        if (password !== confirmpassword) {
            toast.error("Passwords do not match.");
            return;
        }

        const normalizedEmail = email.trim().toLowerCase();

        try {
            const res = await axios.post(
                `http://localhost:8000/blog_app/api/register`,
                { firstName, lastName, email:normalizedEmail, password },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            );

            if (res.data.success) {
                toast.success(res.data.message);
                setTimeout(() => {
                    navigate('/signin');
                }, 2000);
            } else {
                toast.error(res.data.message || "Registration failed.");
            }
        } catch (error) {
            console.error(error);
            const message = error.response?.data?.message || "Something went wrong. Please try again.";
            toast.error(message);
        }
    };

    const handleSignin = () => {
        navigate("/signin");
    };

    return (
        <div className="page pt-[12vh] sm:px-16 px-2 duration-500">
            <div className="h-[85vh] flex flex-col items-center justify-center">
                <h1 className="font-bold mb-8 text-xl flex flex-col items-center">
                    <span>SIGN UP</span>
                    <span className="flex border-2 border-blue-600 mt-1">
                        <span className="blog py-[2px] px-[6px] bg-blue-600 text-white">BLOG</span>
                        <span className="py-[2px] px-[6px] text-blue-600">STUDIO</span>
                    </span>
                </h1>

                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col w-[90%] max-w-[34rem] p-4 shadow-md shadow-black space-y-1 border border-slate-200 bg-slate-50 rounded-md"
                >
                    <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-8">
                        <div className="flex flex-col w-full">
                            <label className="font-md">First Name</label>
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="border px-2 h-[2rem] text-[.9rem] outline-none rounded-md bg-white"
                            />
                        </div>
                        <div className="flex flex-col w-full">
                            <label className="font-md">Last Name</label>
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="border px-2 h-[2rem] text-[.9rem] outline-none rounded-md bg-white"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <label className="font-md">Email ID</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="border px-2 h-[2rem] text-[.9rem] outline-none rounded-md bg-white"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="font-md">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="border px-2 h-[2rem] text-[.9rem] outline-none rounded-md bg-white"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="font-md">Confirm Password</label>
                        <input
                            type="password"
                            value={confirmpassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="border px-2 h-[2rem] text-[.9rem] outline-none rounded-md bg-white"
                        />
                    </div>

                    <div className="flex gap-3 justify-between pt-4">
                        <button
                            type="button"
                            onClick={handleSignin}
                            className="w-1/2 border h-[2rem] text-[1.1rem] font-md cursor-pointer rounded-md bg-white hover:bg-slate-200 duration-500"
                        >
                            Sign In
                        </button>
                        <button
                            type="submit"
                            className="w-1/2 border-blue-600 h-[2rem] text-[1.1rem] font-md cursor-pointer rounded-md bg-blue-600 hover:bg-blue-700 text-white duration-500"
                        >
                            Sign Up
                        </button>
                    </div>
                </form>

                <Toaster position="bottom-right" reverseOrder={false} />
            </div>
        </div>
    );
}
