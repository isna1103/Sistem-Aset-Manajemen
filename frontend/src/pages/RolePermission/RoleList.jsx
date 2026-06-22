import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { Plus, Edit, Trash2, Shield } from 'lucide-react';
import Swal from 'sweetalert2';

const RoleList = () => {
  const { hasPermission } = useContext(AuthContext);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const res = await api.get('/roles');
      setRoles(res.data);
    } catch (err) {
      console.error(err);
      alert('Gagal mengambil data role');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Hapus Role?',
      text: 'Yakin ingin menghapus role ini? Role yang sudah digunakan oleh user tidak dapat dihapus.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/roles/${id}`);
        fetchRoles();
        Swal.fire({ icon: 'success', title: 'Terhapus', text: 'Role berhasil dihapus.', timer: 1500, showConfirmButton: false });
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'Gagal', text: err.response?.data?.message || 'Gagal menghapus role' });
      }
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Memuat data...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manajemen Role & Permission</h1>
          <p className="text-gray-500 text-sm mt-1">Kelola hak akses pengguna dalam sistem</p>
        </div>
        {hasPermission('Manajemen Role & Permission', 'Create') && (
          <Link to="/role-permission/form" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm">
            <Plus size={20} /> Tambah Role Baru
          </Link>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 border-b border-gray-100 text-sm">
              <th className="py-3 px-6 w-16 text-center">ID</th>
              <th className="py-3 px-6">Nama Role</th>
              <th className="py-3 px-6">Deskripsi</th>
              <th className="py-3 px-6 text-center">Total Permission</th>
              <th className="py-3 px-6 text-center w-32">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="py-4 px-6 text-center text-gray-500">{role.id}</td>
                <td className="py-4 px-6 font-semibold text-gray-800 flex items-center gap-2">
                  <Shield size={16} className={role.nama_role === 'Admin' ? 'text-red-500' : 'text-blue-500'} />
                  {role.nama_role}
                </td>
                <td className="py-4 px-6 text-gray-600">{role.deskripsi || '-'}</td>
                <td className="py-4 px-6 text-center">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                    {role.permissions?.length || 0} Akses
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center justify-center gap-2">
                    {hasPermission('Manajemen Role & Permission', 'Update') && (
                      <Link to={`/role-permission/form/${role.id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Edit Role">
                        <Edit size={18} />
                      </Link>
                    )}
                    {hasPermission('Manajemen Role & Permission', 'Delete') && role.nama_role !== 'Admin' && (
                      <button onClick={() => handleDelete(role.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Hapus Role">
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {roles.length === 0 && (
              <tr>
                <td colSpan="5" className="py-8 text-center text-gray-500">Belum ada role terdaftar</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RoleList;
