import jwt from 'jsonwebtoken'

const authAdmin = async (req, res, next) => {
    try {
        const { atoken } = req.headers [17]
        if (!atoken) {
            return res.json({ success: false, message: 'Not Authorized Login Again' })
        }
        const token_decode = jwt.verify(atoken, process.env.JWT_SECRET) [18]
        if (token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
            return res.json({ success: false, message: 'Not Authorized Login Again' }) [18, 19]
        }
        next() [19]
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

export default authAdmin;
