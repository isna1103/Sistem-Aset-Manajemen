const bcrypt = require('bcrypt');
const { User, Role } = require('../../shared/database');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [{
        model: Role,
        as: 'role_info',
        attributes: ['id', 'nama_role', 'deskripsi']
      }],
      attributes: { exclude: ['password_hash'] },
      order: [['created_at', 'DESC']]
    });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { username, password, nama, role_id } = req.body;
    
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) return res.status(400).json({ message: 'Username sudah digunakan' });

    const password_hash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password_hash, nama, role_id });
    
    // omit password before sending
    const userWithoutPassword = user.toJSON();
    delete userWithoutPassword.password_hash;

    res.status(201).json({ message: 'User berhasil dibuat', user: userWithoutPassword });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password, nama, role_id } = req.body;

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });

    if (username && username !== user.username) {
      const existingUser = await User.findOne({ where: { username } });
      if (existingUser) return res.status(400).json({ message: 'Username sudah digunakan' });
      user.username = username;
    }

    if (nama) user.nama = nama;
    if (role_id) user.role_id = role_id;

    if (password) {
      user.password_hash = await bcrypt.hash(password, 10);
    }

    await user.save();

    const userWithoutPassword = user.toJSON();
    delete userWithoutPassword.password_hash;

    res.status(200).json({ message: 'User berhasil diperbarui', user: userWithoutPassword });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });
    
    if (user.username === 'admin') {
      return res.status(403).json({ message: 'Akun super-admin tidak dapat dihapus' });
    }

    await user.destroy();
    res.status(200).json({ message: 'User berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
