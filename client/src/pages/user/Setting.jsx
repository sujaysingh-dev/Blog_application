import { useEffect, useState } from "react";

export default function Setting() {
    const [email, setEmail] = useState('');

    // Load user email from localStorage
    useEffect(() => {
        try {
            const userData = JSON.parse(localStorage.getItem("user"));
            if (userData?.email) {
                setEmail(userData.email);
            }
        } catch (error) {
            console.error("Failed to parse user from localStorage:", error);
        }
    }, []);

    // Reset password
    const handleResetPassword = () => {
        if (!email) {
            alert("No email found.");
            return;
        }

        // Simulate password reset action
        alert(`Password reset link sent to ${email}.`);
    };

    // Delete profile and associated blogs
    const handleDeleteProfile = async () => {
        if (!window.confirm("Are you sure you want to delete your profile? This action cannot be undone.")) {
            return;
        }

        try {
            const response = await fetch("http://localhost:8000/blog_app/api/delete", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to delete profile");
            }

            alert("Profile and associated blogs deleted successfully.");
            localStorage.removeItem("user");
            window.location.href = "/";
        } catch (error) {
            console.error("Error deleting profile:", error);
            alert("An error occurred while deleting your profile.");
        }
    };

    return (
        <div className="page pt-[12vh] sm:px-16 px-4 duration-500">
            <h1 className="text-2xl mb-6">Settings</h1>

            {/* Reset Password Section */}
            <div className="mb-6">
                <h2 className="text-md mb-2">Reset Password</h2>
                <button
                    onClick={handleResetPassword}
                    className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 transition"
                >
                    Send Reset Password Email
                </button>
            </div>

            {/* Delete Profile Section */}
            <div>
                <h2 className="text-md mb-2 text-red-600">Delete Profile</h2>
                <button
                    onClick={handleDeleteProfile}
                    className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition"
                    disabled={!email}
                >
                    Delete Profile
                </button>
            </div>
        </div>
    );
}
