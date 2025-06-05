import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'photo_blog'); // Make sure this folder exists
    },
    filename: function (req, file, cb) {
        // Generate a unique filename with timestamp
        const ext = path.extname(file.originalname); // Extract extension like .jpg
        const uniqueName = `${Date.now()}-${file.fieldname}${ext}`;
        cb(null, uniqueName);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type. Only JPEG, PNG, and JPG are allowed."), false);
    }
};

export const blogUpload = multer({ storage, fileFilter });
