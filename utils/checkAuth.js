import jwt from "jsonwebtoken";

export default (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decode;

    return next();
  } catch (err) {
    res.status(401).json({ msg: "Unauthorizated" });
  }
};
