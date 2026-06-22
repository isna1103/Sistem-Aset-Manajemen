import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import { ArrowLeft, Save } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import Swal from 'sweetalert2';

const RoleForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({ nama_role: '', deskripsi: '' });
  const [allPermissions, setAllPermissions] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Group permissions by menu for the matrix
  const menus = [...new Set(allPermissions.map(p => p.menu))];
  const actions = ['Create', 'Read/View', 'Update', 'Delete', 'Export'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const permRes = await api.get('/permissions');
        setAllPermissions(permRes.data);

        if (id) {
          const roleRes = await api.get('/roles');
          const role = roleRes.data.find(r => r.id === parseInt(id));
          if (role) {
            setFormData({ nama_role: role.nama_role, deskripsi: role.deskripsi || '' });
            setSelectedPermissions(role.permissions.map(p => p.id));
          }
        }
      } catch (err) {
        console.error(err);
        alert('Gagal mengambil data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (permissionId) => {
    if (selectedPermissions.includes(permissionId)) {
      setSelectedPermissions(selectedPermissions.filter(id => id !== permissionId));
    } else {
      setSelectedPermissions([...selectedPermissions, permissionId]);
    }
  };

  const handleSelectAllColumn = (action) => {
    if (formData.nama_role === 'Admin') return;

    const permsInAction = allPermissions.filter(p => p.action === action).map(p => p.id);
    if (permsInAction.length === 0) return;

    const allSelected = permsInAction.every(id => selectedPermissions.includes(id));

    if (allSelected) {
      setSelectedPermissions(selectedPermissions.filter(id => !permsInAction.includes(id)));
    } else {
      const newSelected = new Set([...selectedPermissions, ...permsInAction]);
      setSelectedPermissions(Array.from(newSelected));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, permissionIds: selectedPermissions };
      if (id) {
        await api.put(`/roles/${id}`, payload);
        await Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Role berhasil diperbarui', timer: 1500, showConfirmButton: false });
      } else {
        await api.post('/roles', payload);
        await Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Role berhasil ditambahkan', timer: 1500, showConfirmButton: false });
      }
      navigate('/role-permission');
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Gagal', text: err.response?.data?.message || 'Terjadi kesalahan' });
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Memuat form...</div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 bg-white px-4 py-2 rounded-lg shadow-sm border border-green-100">
          <ArrowLeft size={20} /> Kembali
        </button>
        <h1 className="text-2xl font-bold text-gray-800">{id ? 'Edit Role' : 'Tambah Role Baru'}</h1>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-8">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Role *</label>
              <input type="text" name="nama_role" value={formData.nama_role} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Contoh: Supervisor" disabled={formData.nama_role === 'Admin'} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Deskripsi Role</label>
              <input type="text" name="deskripsi" value={formData.deskripsi} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Penjelasan singkat tugas role ini" />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b">Matriks Hak Akses (Permissions)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-3 border border-gray-200 font-semibold text-gray-700">Menu / Modul</th>
                    {actions.map(action => (
                      <th key={action} className="p-3 border border-gray-200 font-semibold text-gray-700 text-center">{action}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {menus.map(menu => (
                    <tr key={menu} className="hover:bg-gray-50/50">
                      <td className="p-3 border border-gray-200 font-medium text-gray-800">{menu}</td>
                      {actions.map(action => {
                        const perm = allPermissions.find(p => p.menu === menu && p.action === action);
                        return (
                          <td key={action} className="p-3 border border-gray-200 text-center">
                            {perm ? (
                              <input
                                type="checkbox"
                                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                                checked={selectedPermissions.includes(perm.id)}
                                onChange={() => handleCheckboxChange(perm.id)}
                                disabled={formData.nama_role === 'Admin'} // Admin can't be unchecked
                              />
                            ) : (
                              <span className="text-gray-300">-</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-blue-50/30 border-t-2 border-gray-200">
                  <tr>
                    <td className="p-3 border border-gray-200 font-semibold text-gray-800 text-right">Pilih Semua (Select All)</td>
                    {actions.map(action => {
                      const permsInAction = allPermissions.filter(p => p.action === action).map(p => p.id);
                      const allSelected = permsInAction.length > 0 && permsInAction.every(id => selectedPermissions.includes(id));
                      return (
                        <td key={action} className="p-3 border border-gray-200 text-center">
                          <input
                            type="checkbox"
                            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                            checked={allSelected}
                            onChange={() => handleSelectAllColumn(action)}
                            disabled={formData.nama_role === 'Admin'}
                            title={`Pilih semua akses ${action}`}
                          />
                        </td>
                      );
                    })}
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium shadow-sm flex items-center gap-2">
              <Save size={20} /> Simpan Role
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default RoleForm;
