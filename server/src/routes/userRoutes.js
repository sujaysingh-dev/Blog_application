import express from 'express';
import { register, login, logout, profile, editProfile, media, deleteUser }from '../controller/userController.js';
const router = express.Router();
import { upload } from '../middleware/upload.js';

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get("/profile/:email", profile);
router.put("/profile/edit/:email", upload.single("profilePhoto"), editProfile);
router.get("/media", media);
router.delete('/delete', deleteUser);

export default router;