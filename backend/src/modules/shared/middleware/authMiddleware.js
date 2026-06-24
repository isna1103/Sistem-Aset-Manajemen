const jwt = require('jsonwebtoken');
const { User, Role, Permission } = require('../database');

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ message: 'No token provided.' });

  const tokenBody = token.split(' ')[1]; // Format: Bearer <token>

  jwt.verify(tokenBody, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Unauthorized!' });
    req.user = {
      id: decoded.id,
      role_id: decoded.role_id,
      role: decoded.role
    };
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  });
};

const isAdmin = (req, res, next) => {
  if (req.userRole && req.userRole.toLowerCase() === 'admin') {
    next();
    return;
  }
  res.status(403).json({ message: 'Require Admin Role!' });
};

const checkPermission = (menu, action) => {
  return async (req, res, next) => {
    try {
      // If user is Admin, grant full access
      if (req.userRole && req.userRole.toLowerCase() === 'admin') return next();

      const role_id = req.user.role_id;
      if (!role_id) return res.status(403).json({ message: 'No role assigned to user.' });

      const role = await Role.findByPk(role_id, {
        include: [{
          model: Permission,
          as: 'permissions',
          where: { menu, action },
          required: false
        }]
      });

      if (role && role.permissions && role.permissions.length > 0) {
        return next();
      }
      return res.status(403).json({ message: `Forbidden: Require ${action} permission for ${menu} (Role: ${req.userRole}, ID: ${role_id}, PermsLen: ${role?.permissions?.length})` });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Unable to validate permissions: ' + err.message });
    }
  };
};

module.exports = {
  verifyToken,
  isAdmin,
  checkPermission
};
