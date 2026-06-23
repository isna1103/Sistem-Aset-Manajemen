const { Role, Permission, RolePermission, User } = require('../models');

exports.getRoles = async (req, res) => {
  try {
    const roles = await Role.findAll({
      include: [{
        model: Permission,
        as: 'permissions'
      }],
      order: [['created_at', 'DESC']]
    });
    res.status(200).json(roles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPermissions = async (req, res) => {
  try {
    const permissions = await Permission.findAll();
    res.status(200).json(permissions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createRole = async (req, res) => {
  try {
    const { nama_role, deskripsi, permissionIds } = req.body;
    const role = await Role.create({ nama_role, deskripsi });
    
    if (permissionIds && permissionIds.length > 0) {
      await role.setPermissions(permissionIds);
    }
    
    res.status(201).json({ message: 'Role created successfully', role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_role, deskripsi, permissionIds } = req.body;
    
    const role = await Role.findByPk(id);
    if (!role) return res.status(404).json({ message: 'Role not found' });

    if (nama_role) role.nama_role = nama_role;
    if (deskripsi !== undefined) role.deskripsi = deskripsi;
    await role.save();

    if (permissionIds !== undefined) {
      await role.setPermissions(permissionIds);
    }

    res.status(200).json({ message: 'Role updated successfully', role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await Role.findByPk(id);
    if (!role) return res.status(404).json({ message: 'Role not found' });
    
    // Check if role is used by any users
    const usersCount = await User.count({ where: { role_id: id } });
    if (usersCount > 0) {
      return res.status(400).json({ message: 'Cannot delete role assigned to users' });
    }

    await role.destroy();
    res.status(200).json({ message: 'Role deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
