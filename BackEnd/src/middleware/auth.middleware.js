const userModel = require("../model/user/user.model");
const blackListTokenModel = require("../model/user/blackListTokenModel.model");
const jwt = require("jsonwebtoken");

module.exports.isAuthenticated = async (req,res,next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
        if(!token){
            return res.status(401).json({ error: "Token not found you are Unauthorized" });
        }

        const blackListToken = await blackListTokenModel.findOne({ token });
        if (blackListToken) {
            return res.status(401).json({ error: "Token is blacklisted you are Unauthorized" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ error: "User not found you are Unauthorized" });
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
}

module.exports.isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ error: "Access denied. Admins only." });
    }
    next();
};