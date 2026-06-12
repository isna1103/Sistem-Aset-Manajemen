const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ message: 'No token provided.' });

  const tokenBody = token.split(' ')[1]; // Format: Bearer <token>

  jwt.verify(tokenBody, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Unauthorized!' });
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  });
};

const isAdmin = (req, res, next) => {
  if (req.userRole === 'Admin') {
    next();
    return;
  }
  res.status(403).json({ message: 'Require Admin Role!' });
};

module.exports = {
  verifyToken,
  isAdmin
};
