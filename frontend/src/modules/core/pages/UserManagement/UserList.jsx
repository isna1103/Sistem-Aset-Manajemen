import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../../services/api';
import { AuthContext } from '../../../shared/context/AuthContext';
import { Plus, Edit, Trash2, Users } from 'lucide-react';
import Swal from 'sweetalert2';

const UserList = () => {
  const { hasPermission, user: currentUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      alert('Gagal mengambil data user: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, username) => {
    if (username === 'admin') {
      return Swal.fire({ icon: 'error', title: 'Akses Ditolak', text: 'Akun super-admin tidak dapat dihapus!' });
    }
    if (username === currentUser?.username) {
      return Swal.fire({ icon: 'warning', title: 'Peringatan', text: 'Anda tidak dapat menghapus akun Anda sendiri saat sedang login!' });
    }

    const result = await Swal.fire({
      title: 'Hapus User?',
      text: `Yakin ingin menghapus akun ${username}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/users/${id}`);
        fetchUsers();
        Swal.fire({ icon: 'success', title: 'Terhapus', text: 'Akun user berhasil dihapus.', timer: 1500, showConfirmButton: false });
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'Gagal', text: err.response?.data?.message || 'Gagal menghapus user' });
      }
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Memuat data...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manajemen User</h1>
          <p className="text-gray-500 text-sm mt-1">Kelola akun pengguna dan role-nya</p>
        </div>
        {hasPermission('Manajemen User', 'Create') && (
          <Link to="/user-management/form" className="bg-green-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm">
            <Plus size={20} /> Tambah User Baru
          </Link>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 border-b border-gray-100 text-sm">
              <th className="py-3 px-6 text-center w-16">No.</th>
              <th className="py-3 px-6">Nama Lengkap</th>
              <th className="py-3 px-6">Username</th>
              <th className="py-3 px-6">Role</th>
              <th className="py-3 px-6 text-center w-32">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, index) => (
              <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="py-4 px-6 text-center text-gray-500">{index + 1}</td>
                <td className="py-4 px-6 font-medium text-gray-800">{u.nama}</td>
                <td className="py-4 px-6 text-gray-600">@{u.username}</td>
                <td className="py-4 px-6">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${u.role_info?.nama_role === 'Admin' ? 'bg-red-100 text-red-700' :
                    u.role_info?.nama_role === 'Manajemen' ? 'bg-purple-100 text-purple-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                    {u.role_info?.nama_role || 'No Role'}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center justify-center gap-2">
                    {hasPermission('Manajemen User', 'Update') && (
                      <Link to={`/user-management/form/${u.id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Edit User">
                        <Edit size={18} />
                      </Link>
                    )}
                    {hasPermission('Manajemen User', 'Delete') && u.username !== 'admin' && (
                      <button onClick={() => handleDelete(u.id, u.username)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Hapus User">
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="5" className="py-8 text-center text-gray-500">Belum ada user terdaftar</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;
