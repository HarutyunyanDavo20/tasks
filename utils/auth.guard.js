const jwt =require("jsonwebtoken")

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = (authHeader && authHeader.startsWith('Bearer') && authHeader.split(' ')[1]) || null;

    if (token) {
      req.user = jwt.verify(token, process.env.JWT_SECRET);
      next()
    } else {
      res.status(401).json({ msg: "Unauthorized" });
    }
  } catch (err) {
    res.status(401).json({ msg: "Unauthorized" });
  }
};
