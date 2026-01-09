/** @format */
import jwt from 'jsonwebtoken';
// user authentication middleware
const authUser = async (req, res, next) => {
    try {
        // --- START NEW LOGIC ---
        const authHeader = req.headers.authorization; 

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            // Fails if header is missing OR if it doesn't start with "Bearer "
            return res.status(401).json({ success: false, message: "Not Authorized Login Again" });
        }
        
        // Extract the actual token string by removing "Bearer "
        const token = authHeader.split(' ')[1];
        // --- END NEW LOGIC ---
        
        if (!token) {
            return res.status(401).json({ success: false, message: "Not Authorized Login Again" });
        }
        
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);

 req.userId = token_decode.id;

    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export default authUser;
