import jwt from "jsonwebtoken";

export default (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decode;
    
    return next();
  } catch (err) {
    res.status(401).json({ message: "Unauthorizated" });
  }
};
