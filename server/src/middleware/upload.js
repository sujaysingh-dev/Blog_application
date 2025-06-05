import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "photo_user"); // folder to store uploaded photos
    },
    filename: function (req, file, cb) {
        const userId = req.body._id || "unknown";
        const uniqueName = `${userId}.jpg`;  // Always use .jpg extension
        cb(null, uniqueName);
    },
});

// File filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type. Only JPEG, PNG, and JPG are allowed."), false);
    }
};

export const upload = multer({ storage, fileFilter });
