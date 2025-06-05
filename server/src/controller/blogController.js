import Blog from '../models/blogModel.js';
import User from '../models/userModel.js'; 
import slugify from 'slugify';
import path from 'path'
import fs from 'fs'

export const post_blog = async (req, res) => {
    try {
        const { category, title, content, tags, published, author } = req.body;

        // Validate required fields
        if (!category || !title || !content) {
            return res.status(400).json({
                success: false,
                message: "Category, title, and content (description) are required."
            });
        }

        // Parse and clean tags
        const tagArray = tags ? tags.split(',').map(tag => tag.trim()) : [];

        // Handle uploaded image
        let image = '';
        if (req.file && req.file.filename) {
            image = `/photo_blog/${req.file.filename}`;
        }

        // Resolve author (from authenticated user or provided email)
        let authorId = null;

        if (req.user?._id) {
            authorId = req.user._id;
        } else if (author) {
            const foundUser = await User.findOne({ email: author });
            if (!foundUser) {
                return res.status(400).json({
                    success: false,
                    message: "Author not found"
                });
            }
            authorId = foundUser._id;
        } else {
            return res.status(400).json({
                success: false,
                message: "Author information is missing"
            });
        }

        // Create blog entry
        const blog = new Blog({
            category,
            title,
            slug: slugify(title, { lower: true, strict: true }),
            description: content,
            tags: tagArray,
            image,
            published: published === 'true' || published === true,
            author: authorId
        });

        await blog.save();

        return res.status(201).json({
            success: true,
            message: "Blog saved successfully",
            blog
        });

    } catch (error) {
        console.error('Error in post_blog:', error);
        return res.status(500).json({
            success: false,
            message: "Failed to save blog",
            error: error.message
        });
    }
};

export const all_blogs = async (req, res) => {
  try {
    // Get email from query params or headers (whichever you send from client)
    const userEmail = req.query.email || req.headers['x-user-email'];

    if (!userEmail) {
      return res.status(400).json({
        success: false,
        message: "User email is required to fetch blogs."
      });
    }

    // Find user by email
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found."
      });
    }

    // Fetch blogs by this user's _id
    const blogs = await Blog.find({ author: user._id }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      blogs
    });

  } catch (error) {
    console.error("Error fetching blogs for user:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user blogs.",
      error: error.message
    });
  }
};

export const edit_blog = async (req, res) => {
    try {
        const { id } = req.params;

        // Destructure fields from req.body
        let {
            title,
            category,
            description,
            tags,
            published
        } = req.body;

        // Convert published to boolean (comes as string from FormData)
        published = published === "true" || published === true;

        // Parse tags if it's a string, else leave as is (e.g., if already array)
        if (typeof tags === "string") {
            tags = tags.split(",").map(t => t.trim());
        }

        // Prepare updated fields object
        const updatedData = {
            title,
            category,
            description,
            tags,
            published,
        };

        // Handle image file if uploaded (multer middleware)
        if (req.file) {
            updatedData.image = `/uploads/${req.file.filename}`;
        }

        // Remove undefined fields (optional, to avoid overwriting with undefined)
        Object.keys(updatedData).forEach(key => {
            if (updatedData[key] === undefined) delete updatedData[key];
        });

        // Update blog post in DB
        const updatedBlog = await Blog.findByIdAndUpdate(id, updatedData, {
            new: true,
            runValidators: true
        });

        if (!updatedBlog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        res.status(200).json(updatedBlog);
    } catch (error) {
        console.error("Edit blog error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const single_blog = async (req, res) => {
  try {
    const { id } = req.params;

    // Find blog by ID
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json(blog);
  } catch (error) {
    console.error("Error fetching single blog:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const delete_blog = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Find the blog first to get the image path
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // 2. Delete the image file if it exists
    if (blog.image) {
      const imagePath = path.join(process.cwd(), blog.image); // This assumes blog.image is a relative path
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Failed to delete image:", err);
        } else {
          console.log("Image deleted:", imagePath);
        }
      });
    }

    // 3. Delete the blog post from database
    await Blog.findByIdAndDelete(id);

    res.status(200).json({ message: "Blog and image deleted successfully" });
  } catch (error) {
    console.error("Delete blog error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const read_blog = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Post ID is required" });
    }

    const post = await Blog.findById(id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.json(post);
  } catch (error) {
    console.error("Error fetching single blog:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const publicBlog = async (req, res) => {
  try {
    const blogs = await Blog.find({ published: true }) // filter where isPublic is true
      .populate('author', 'firstName lastName') // populate only needed author fields
      .sort({ createdAt: -1 });

    res.status(200).json(blogs);
  } catch (err) {
    console.error('Error fetching public blogs:', err);
    res.status(500).json({ message: 'Failed to fetch blogs' });
  }
}

export const publicBlogRead = async (req, res) => {
  try {
    const post = await Blog.findById(req.params.id).populate('author', 'firstName lastName');
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: "Error fetching post", error: err.message });
  }
};
