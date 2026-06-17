const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Role, Permission } = require('../models');

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ 
      where: { username },
      include: [{
        model: Role,
        as: 'role_info',
        include: [{
          model: Permission,
          as: 'permissions'
        }]
      }]
    });

    if (!user) {
      return res.status(404).json({ message: 'User Not found.' });
    }

    const passwordIsValid = await bcrypt.compare(password, user.password_hash);
    if (!passwordIsValid) {
      return res.status(401).json({ accessToken: null, message: 'Invalid Password!' });
    }

    const roleName = user.role_info ? user.role_info.nama_role : null;

    const token = jwt.sign({ id: user.id, role_id: user.role_id, role: roleName }, process.env.JWT_SECRET, {
      expiresIn: 86400 // 24 hours
    });

    res.status(200).json({
      id: user.id,
      username: user.username,
      nama: user.nama,
      role: roleName,
      role_id: user.role_id,
      permissions: user.role_info ? user.role_info.permissions : [],
      accessToken: token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.logout = (req, res) => {
  // Client side should handle token deletion, backend can optionally blacklist token
  res.status(200).json({ message: 'Logout successful.' });
};
