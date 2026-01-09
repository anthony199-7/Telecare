import multer from "multer";

const storage = multer.diskStorage({
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    },
});

const fileFilter = (req, file, callback) => {
    // Check for supported image MIME types
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        callback(null, true);
    } else {
        // Reject the file and provide a clear error message
        callback(new Error("File type not supported. Only JPEG, JPG, and PNG are allowed."), false);
    }
};

const upload = multer({ 
    storage, 
    fileFilter // <--- Include the filter here
});

export default upload;







































/** @format

import multer from "multer";

const storage = multer.diskStorage({
  filename: function (req, file, callback) {
    callback(null,file.originalname);
  },
});

const upload = multer({ storage });

export default upload; */
