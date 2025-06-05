import express from 'express'
import { all_blogs, delete_blog, edit_blog, post_blog, publicBlog, publicBlogRead, read_blog, single_blog } from '../controller/blogController.js'
import {blogUpload} from '../middleware/blogUpload.js'
const router = express.Router();

router.post('/post_blog', blogUpload.single("image"), post_blog);
router.get('/all_blogs', all_blogs);
router.put("/posts/:id", blogUpload.single("image"), edit_blog);
router.get("/posts/:id", single_blog);
router.delete("/posts/:id", delete_blog);
router.get("/readposts/:id", read_blog);
router.get("/publicBlog", publicBlog);
router.get("/public_read_more/:id", publicBlogRead);

export default router;