import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function EditProfile() {
    const navigate = useNavigate();

    const [userId, setUserId] = useState('');
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [bio, setBio] = useState('');
    const [qualification, setQualification] = useState('');
    const [linkedin, setLinkedin] = useState('');
    const [github, setGithub] = useState('');
    const [instagram, setInstagram] = useState('');
    const [facebook, setFacebook] = useState('');
    const [profilePhoto, setProfilePhoto] = useState('');
    const [selectedPhotoFile, setSelectedPhotoFile] = useState(null);

    // Safely get email from localStorage
    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('user');
            if (!storedUser) {
                toast.error("User not logged in");
                navigate("/login");
                return;
            }

            const parsedUser = JSON.parse(storedUser);
            if (!parsedUser?.email) {
                toast.error("Invalid user data");
                navigate("/login");
                return;
            }

            setEmail(parsedUser.email);
        } catch (err) {
            console.error("Error parsing user from localStorage:", err);
            toast.error("Error reading user data");
            navigate("/login");
        }
    }, [navigate]);

    // Fetch profile data
    useEffect(() => {
        if (!email) return;

        fetch(`http://localhost:8000/blog_app/api/profile/${email}`)
            .then(res => res.json())
            .then(data => {
                setUserId(data._id);
                setFirstName(data.firstName || '');
                setLastName(data.lastName || '');
                setBio(data.bio || '');
                setQualification(data.qualification || '');
                setLinkedin(data.linkedin || '');
                setGithub(data.github || '');
                setInstagram(data.instagram || '');
                setFacebook(data.facebook || '');
                setProfilePhoto(data.profilePhoto ? data.profilePhoto.startsWith('http') ? data.profilePhoto : `http://localhost:8000${data.profilePhoto}` : '');
            })
            .catch(err => {
                console.error("Failed to fetch profile:", err);
                toast.error("Unable to load profile");
            });
    }, [email]);

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedPhotoFile(file);
            setProfilePhoto(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !userId) { // ensure _id is available
            toast.error("User information is incomplete");
            return;
        }

        const formData = new FormData();
        formData.append("_id", userId); // Add _id here
        formData.append("email", email);
        formData.append("firstName", firstName);
        formData.append("lastName", lastName);
        formData.append("bio", bio);
        formData.append("qualification", qualification);
        formData.append("linkedin", linkedin);
        formData.append("github", github);
        formData.append("instagram", instagram);
        formData.append("facebook", facebook);

        if (selectedPhotoFile) {
            formData.append("profilePhoto", selectedPhotoFile);
        }

        try {
            const response = await fetch(`http://localhost:8000/blog_app/api/profile/edit/${encodeURIComponent(email)}`, {
                method: "PUT",
                body: formData
            });

            const result = await response.json();

            if (response.ok) {
                toast.success("Profile updated successfully");
                setTimeout(() => window.location.href = "/profile", 2000);
            } else {
                toast.error(result.message || "Failed to update profile");
            }
        } catch (err) {
            console.error("Error submitting profile update:", err);
            toast.error("Server error occurred");
        }
    };


    return (
        <div className="page pt-[12vh] px-4 sm:px-16 duration-500">
            <div className="text-xl mb-4">Edit Profile</div>

            <form onSubmit={handleSubmit} className="mt-8 w-full max-w-2xl space-y-4">
                <div className="flex flex-col md:flex-row gap-6 md:gap-16">
                    {/* Profile Photo */}
                    <div className="flex flex-col items-center md:items-start">
                        <label htmlFor="photo-upload">
                            <div
                                className="w-28 h-28 md:w-[120px] md:h-[120px] rounded-full border border-gray-300 shadow bg-center bg-cover bg-gray-100 mb-4 cursor-pointer hover:opacity-80 transition flex items-center justify-center"
                                style={{ backgroundImage: profilePhoto ? `url(${profilePhoto})` : "none" }}
                            >
                                {!profilePhoto && (
                                    <div className="text-gray-400 text-sm">No photo</div>
                                )}
                            </div>
                        </label>
                        <input
                            id="photo-upload"
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoChange}
                            className="hidden"
                        />
                    </div>

                    {/* Form Fields */}
                    <div className="flex flex-col flex-1 space-y-1">
                        <div className="flex flex-col sm:flex-row gap-1 sm:gap-4">
                            <div className="flex flex-col flex-1">
                                <label className="font-bold mb-1">First Name</label>
                                <input
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="border px-2 text-sm rounded h-[2rem]"
                                />
                            </div>
                            <div className="flex flex-col flex-1">
                                <label className="font-bold mb-1">Last Name</label>
                                <input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="border h-[2rem] px-2 text-sm rounded"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <label className="font-bold mb-1">Bio</label>
                            <textarea
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                className="border h-[4rem] px-2 py-1 text-sm rounded"
                            ></textarea>
                        </div>

                        <div className="flex flex-col">
                            <label className="font-bold mb-1">Qualification</label>
                            <input
                                type="text"
                                value={qualification}
                                onChange={(e) => setQualification(e.target.value)}
                                className="border h-[2rem] px-2 text-sm rounded w-full"
                            />
                        </div>

                        {[ 
                            { label: "LinkedIn", value: linkedin, setter: setLinkedin },
                            { label: "Github", value: github, setter: setGithub },
                            { label: "Instagram", value: instagram, setter: setInstagram },
                            { label: "Facebook", value: facebook, setter: setFacebook },
                        ].map((item, index) => (
                            <div className="flex flex-col" key={index}>
                                <label className="font-bold mb-1">{item.label} Profile Link</label>
                                <input
                                    type="text"
                                    value={item.value}
                                    onChange={(e) => item.setter(e.target.value)}
                                    className="border h-[2rem] px-2 text-sm rounded w-full"
                                />
                            </div>
                        ))}
                        <div className="flex justify-end">
                            <button type="submit" className="my-4 bg-blue-500 px-4 rounded-sm py-1 w-full text-white hover:bg-blue-600 duration-500 cursor-pointer">
                                Save Profile
                            </button>
                        </div>
                    </div>
                </div>

                
            </form>

            <Toaster position="bottom-right" reverseOrder={true} />
        </div>
    );
}
