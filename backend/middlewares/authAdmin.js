/** @format */

// admin authentication middleware
const authAdmin = async (req, res) => {
  try {
    const { aToken } = req.headers;
    console.log("aToken:", aToken); // Check if token exists
    if (!aToken) {
      return res.json({ success: true, message: "Not Authorized Login Again" });
    }

    const token_decode = jwt.verify(aToken, process.env.JWT_SECRET);

    if (token_decode.email !== process.env.ADMIN_EMAIL) {
    return res.json({
        success: false,
        message: "Not Authorized - Incorrect Admin Token"
    });
}

    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export default authAdmin;
