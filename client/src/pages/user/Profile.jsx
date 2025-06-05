import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
    const [profileData, setProfileData] = useState(null);
    const [profilePhotoUrl, setProfilePhotoUrl] = useState('');
    const navigate = useNavigate();

    const user = (() => {
        try {
            return JSON.parse(localStorage.getItem('user'));
        } catch (err) {
            console.error("Failed to parse user from localStorage", err);
            return null;
        }
    })();

    const email = user?.email;

    useEffect(() => {
        if (!email) {
            console.warn("No email found in localStorage.");
            return;
        }

        const fetchProfile = async () => {
            try {
                const response = await fetch(`http://localhost:8000/blog_app/api/profile/${email}`);
                if (!response.ok) {
                    throw new Error("Profile fetch failed");
                }

                const data = await response.json();
                setProfileData(data);

                if (data.profilePhoto) {
                    let photoPath = data.profilePhoto;

                    // If path doesn't already start with http, prepend full domain
                    if (!photoPath.startsWith("http")) {
                        photoPath = `http://localhost:8000${photoPath}`;
                    }

                    setProfilePhotoUrl(photoPath);
                } else {
                    setProfilePhotoUrl('');
                }


            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        };

        fetchProfile();
    }, [email]);

    const handleEditProfile = () => {
        navigate('/editProfile');
    };

    const renderProfileLink = (label, url) => (
        <div className="flex flex-col mt-2">
            <label className="font-bold">{label}</label>
            {url ? (
                <a
                    href={url.startsWith('http') ? url : `https://${url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-fit text-sm text-blue-400 hover:underline"
                >
                    {url}
                </a>
            ) : (
                <span className="w-fit text-sm text-red-400">Link not available</span>
            )}
        </div>
    );

    return (
        <div className="page pt-[12vh] sm:px-16 px-4 duration-500">
            <h1 className="text-xl">Profile</h1>

            <div className="flex flex-col sm:flex-row gap-6 sm:gap-20 mt-6">
                {/* Profile Photo */}
                <div className="w-[120px] h-[120px] rounded-full border border-gray-300 shadow bg-center bg-cover bg-gray-100 mb-4 mt-6 overflow-hidden">
                    {profilePhotoUrl ? (
                        <img src={profilePhotoUrl} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                            No photo
                        </div>
                    )}
                </div>


                {/* Profile Info */}
                <div className="mt-4 sm:mt-6 w-full sm:w-fit">
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-12">
                        <div className="flex flex-col">
                            <label className="font-bold">First Name</label>
                            <label className="-mt-1 text-sm capitalize">
                                {profileData?.firstName || 'Loading...'}
                            </label>
                        </div>
                        <div className="flex flex-col">
                            <label className="font-bold">Last Name</label>
                            <label className="-mt-1 text-sm capitalize">
                                {profileData?.lastName || 'Loading...'}
                            </label>
                        </div>
                    </div>

                    <div className="flex flex-col mt-2">
                        <label className="font-bold">Bio</label>
                        <label className="-mt-1 text-sm">
                            {profileData?.bio || 'No bio available'}
                        </label>
                    </div>

                    <div className="flex flex-col mt-2">
                        <label className="font-bold">Qualification</label>
                        <label className="-mt-1 text-sm">
                            {profileData?.qualification || 'Not specified'}
                        </label>
                    </div>

                    {renderProfileLink("LinkedIn", profileData?.linkedin)}
                    {renderProfileLink("GitHub", profileData?.github)}
                    {renderProfileLink("Instagram", profileData?.instagram)}
                    {renderProfileLink("Facebook", profileData?.facebook)}

                    <div className="flex justify-end">
                        <button
                            onClick={handleEditProfile}
                            className="my-4 bg-blue-500 px-4 rounded-sm py-1 w-full text-white hover:bg-blue-600 duration-500 cursor-pointer"
                        >
                            Edit Profile
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
