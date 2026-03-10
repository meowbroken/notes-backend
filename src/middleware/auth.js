import jwt from "jsonwebtoken";

export const requireAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader?.startsWith("Bearer ")) 
        return res.status(401).json({ message: "Unauthorized" });

    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
        if(err) return res.status(403).json({ message: "Forbidden" });
        req.userId = payload.id;
        next();
    }); 
};