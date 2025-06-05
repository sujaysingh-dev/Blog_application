import User from "../models/userModel.js";
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import path from 'path'
import fs from "fs";
import Blog from "../models/blogModel.js";

export const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        // Check for missing fields
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "every fields are required"
            });
        }

        // Validate email format
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email address"
            });
        }

        // Check password length
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters long"
            });
        }

        // Check if user already exists
        const existUser = await User.findOne({ email });
        if (existUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists. Please log in."
            });
        }

        // Hash password
        const hashedPassword = await bcryptjs.hash(password, 10);

        // Create new user
        await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword
        });

        return res.status(201).json({
            success: true,
            message: "Account created successfully"
        });
    } catch (error) {
        console.error('Error in userController register:', error);
        return res.status(500).json({
            success: false,
            message: "Failed to register user"
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Every field is required"
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Incorrect email"
            });
        }

        const isPasswordMatch = await bcryptjs.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const token = jwt.sign({ userId: user._id }, process.env.SECRET, { expiresIn: '1d' });

        // Set cookie and respond
        res.cookie("token", token, {
            maxAge: 24 * 60 * 60 * 1000, // 1 day
            httpOnly: true,
            sameSite: "strict"
        });

        return res.status(200).json({
            success: true,
            message: `Welcome back ${user.firstName}`,
            user
        });

    } catch (error) {
        console.error('Error in userController login:', error);
        return res.status(500).json({
            success: false,
            message: "Failed to login user"
        });
    }
};

export const logout = async (_, res) => {
    try{
        return res.status(200).cookie("token", "", {maxAge:0}).json({success:true, message: "logout successfully"})
    }catch(error){

    }
}

export const profile = async (req, res) => {
    const { email } = req.params; 
    if (!email) return res.status(400).json({ error: "Email is required" });

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: "User not found" });

        return res.json(user);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

export const editProfile = async (req, res) => {
    try {
        const email = req.params.email;

        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }

        const {
            firstName,
            lastName,
            bio,
            qualification,
            linkedin,
            github,
            instagram,
            facebook,
        } = req.body;

        const existingProfile = await User.findOne({ email });

        if (!existingProfile) {
            return res.status(404).json({ error: "Profile not found" });
        }

        // If a file was uploaded, set the path
        if (req.file) {
            existingProfile.profilePhoto = `/photo_user/${req.file.filename}`;
        }

        // Update other fields
        existingProfile.firstName = firstName || existingProfile.firstName;
        existingProfile.lastName = lastName || existingProfile.lastName;
        existingProfile.bio = bio || existingProfile.bio;
        existingProfile.qualification = qualification || existingProfile.qualification;
        existingProfile.linkedin = linkedin || existingProfile.linkedin;
        existingProfile.github = github || existingProfile.github;
        existingProfile.instagram = instagram || existingProfile.instagram;
        existingProfile.facebook = facebook || existingProfile.facebook;

        await existingProfile.save();

        res.status(200).json({
            message: "Profile updated successfully",
            profile: existingProfile,
        });

    } catch (error) {
        console.error("Error editing profile:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const media = async (req, res) => {
    try {
        const mediaDir = path.join(process.cwd(), "photo_user");

        fs.readdir(mediaDir, (err, files) => {
            if (err) {
                return res.status(500).json({ message: "Failed to read media directory" });
            }

            res.json({ files });
        });
    } catch (error) {
        res.status(500).json({ error: "Error reading media files" });
    }
};

export const deleteUser = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required.' });
    }

    try {
        // 1. Find the user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // 2. Delete user's profile image (if exists)
        if (user.profilePhoto) {
            const profileImagePath = path.join(process.cwd(), user.profilePhoto);
            fs.unlink(profileImagePath, err => {
                if (err) {
                    console.error('Failed to delete profile image:', err);
                } else {
                    console.log('Deleted profile image:', profileImagePath);
                }
            });
        }

        // 3. Find and delete all blog images by this user
        const blogs = await Blog.find({ author: user._id });
        for (const blog of blogs) {
            if (blog.image) {
                const blogImagePath = path.join(process.cwd(), blog.image);
                fs.unlink(blogImagePath, err => {
                    if (err) {
                        console.error(`Failed to delete blog image (${blog._id}):`, err);
                    } else {
                        console.log('Deleted blog image:', blogImagePath);
                    }
                });
            }
        }

        // 4. Delete all blogs by the user
        await Blog.deleteMany({ author: user._id });

        // 5. Delete the user
        await User.findByIdAndDelete(user._id);

        res.status(200).json({ message: 'User, profile image, and blogs deleted successfully.' });
    } catch (err) {
        console.error('Error deleting user and blogs:', err);
        res.status(500).json({ message: 'Server error.' });
    }
};



