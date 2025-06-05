import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { CiMenuKebab } from "react-icons/ci";
import { useUser } from "../context/UserContext";

export default function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, setUser } = useUser();

    const [userDrop, setUserDrop] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [profilePhotoUrl, setProfilePhotoUrl] = useState('');
    const [profileData, setProfileData] = useState(null);

    const isActive = (path) => location.pathname === path;

    const toggleMenu = () => {
        setMenuOpen(prev => {
            if (!prev) setUserDrop(false);
            return !prev;
        });
    };

    const toggleDrop = () => {
        setUserDrop(prev => {
            if (!prev) setMenuOpen(false);
            return !prev;
        });
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
        navigate("/");
        setUserDrop(false);
        setMenuOpen(false);
    };

    const short = user?.name
        ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase()
        : user?.email
            ? user.email[0].toUpperCase()
            : "";

    // ✅ FIX: Ensure email exists before fetching
    useEffect(() => {
        const email = user?.email;
        if (!email) return;

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
    }, [user]);

    return (
        <>
            <header className="fixed top-0 left-0 w-full h-[10vh] bg-white shadow-md flex items-center justify-between px-4 sm:px-16 z-50">
                <Link to="/" className="flex border-2 border-blue-600">
                    <span className="blog py-[2px] px-[4px] bg-blue-600 text-white">BLOG</span>
                    <span className="py-[2px] px-[4px] text-blue-600">STUDIO</span>
                </Link>

                <div className="flex items-center gap-2">
                    {user ? (
                        <button
                            onClick={toggleDrop}
                            title={user.name || user.email}
                            className="h-[1.9rem] w-[1.9rem] rounded-full border border-blue-600 overflow-hidden flex items-center justify-center bg-gray-100 cursor-pointer"
                        >
                            {profilePhotoUrl ? (
                                <img
                                    src={profilePhotoUrl}
                                    alt="Profile"
                                    className="h-full w-full object-cover"
                                    onError={(e) => e.target.style.display = 'none'}
                                />
                            ) : (
                                <span className="text-blue-600 font-semibold text-sm">{short}</span>
                            )}
                        </button>
                    ) : (
                        <Link to="/signin" className="border border-blue-600 px-3 pb-[2px] pt-[1px] rounded-full text-sm hover:bg-blue-50 transition">
                            Login
                        </Link>
                    )}

                    <button onClick={toggleMenu} className="text-blue-600 hover:text-blue-700">
                        <CiMenuKebab className="text-[2rem] cursor-pointer p-1 bg-gray-200 rounded-full" />
                    </button>
                </div>
            </header>

            {/* Sidebar menu */}
            <div className={`fixed top-0 right-0 h-full w-48 bg-white shadow-lg z-40 transform transition-transform duration-500 ease-in-out ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <nav className="flex flex-col items-start px-4 space-y-3 text-md font-medium pt-[12vh]">
                    {user ? (
                        <>
                            <Link to="/new_post" onClick={toggleMenu} className="px-4 py-1 bg-orange-500/60 rounded-full">New Post</Link>
                            <div className="w-full border-t my-2"></div>
                            {['post', 'comments', 'earnings', 'setting'].map((route) => (
                                <Link
                                    key={route}
                                    to={`/${route}`}
                                    onClick={toggleMenu}
                                    className={`px-2 capitalize ${isActive(`/${route}`) ? 'text-orange-500 font-semibold' : ''}`}
                                >
                                    {route}
                                </Link>
                            ))}
                            <span className="px-2 text-red-500 cursor-pointer" onClick={logout}>Logout</span>
                        </>
                    ) : (
                        <>
                            <Link to="/" onClick={toggleMenu}>Home</Link>
                            <Link to="/public_blog" onClick={toggleMenu}>Public Blog</Link>
                            <Link to="/about" onClick={toggleMenu}>About Us</Link>
                            <Link to="/contact" onClick={toggleMenu}>Contact Us</Link>
                        </>
                    )}
                </nav>
            </div>

            {/* Avatar dropdown */}
            {user && (
                <div className={`fixed top-0 right-0 h-fit w-48 bg-white shadow-lg z-40 transform transition-transform duration-500 ease-in-out ${userDrop ? 'translate-x-0' : 'translate-x-full'}`}>
                    <nav className="flex flex-col items-start px-4 space-y-3 text-md font-medium pt-[12vh]">
                        <Link to="/profile" onClick={toggleDrop}>Profile</Link>
                        <Link to="/new_post" onClick={toggleDrop}>New Post</Link>
                        <span onClick={logout} className="pb-4 cursor-pointer text-red-500">Logout</span>
                    </nav>
                </div>
            )}

            {/* Backdrops */}
            {menuOpen && <div className="fixed top-0 left-0 w-full h-full bg-black/30 z-30" onClick={toggleMenu} />}
            {userDrop && <div className="fixed top-0 left-0 w-full h-full bg-black/30 z-30" onClick={toggleDrop} />}
        </>
    );
}
