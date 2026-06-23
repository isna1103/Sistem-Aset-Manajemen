import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../../services/api';
import { ArrowLeft, Save } from 'lucide-react';
import Swal from 'sweetalert2';

const UserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    nama: '',
    username: '',
    password: '',
    role_id: ''
  });
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rolesRes = await api.get('/roles');
        setRoles(rolesRes.data);

        if (id) {
          const userRes = await api.get('/users');
          const user = userRes.data.find(u => u.id === parseInt(id));
          if (user) {
            setFormData({
              nama: user.nama,
              username: user.username,
              password: '', // Password is not returned, keep empty
              role_id: user.role_id || ''
            });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      if (id) {
        if (!payload.password) delete payload.password; // Don't send empty password on edit
        await api.put(`/users/${id}`, payload);
        await Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Data user berhasil diperbarui', timer: 1500, showConfirmButton: false });
      } else {
        await api.post('/users', payload);
        await Swal.fire({ icon: 'success', title: 'Berhasil', text: 'User berhasil ditambahkan', timer: 1500, showConfirmButton: false });
      }
      navigate('/user-management');
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Gagal', text: err.response?.data?.message || 'Terjadi kesalahan' });
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Memuat form...</div>;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
          <ArrowLeft size={20} /> Kembali
        </button>
        <h1 className="text-2xl font-bold text-gray-800">{id ? 'Edit User' : 'Tambah User Baru'}</h1>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Lengkap *</label>
            <input type="text" name="nama" value={formData.nama} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Masukkan nama lengkap" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Username *</label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Username untuk login" disabled={formData.username === 'admin'} />
            {formData.username === 'admin' && <p className="text-xs text-red-500 mt-1">Username super-admin tidak dapat diubah.</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password {id ? '(Opsional)' : '*'}
            </label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required={!id} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder={id ? "Kosongkan jika tidak ingin mengubah password" : "Password untuk login"} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Role *</label>
            <select name="role_id" value={formData.role_id} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
              <option value="" disabled>Pilih Role</option>
              {roles.map(r => (
                <option key={r.id} value={r.id}>{r.nama_role}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end pt-6 border-t border-gray-100">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium shadow-sm flex items-center gap-2">
              <Save size={20} /> Simpan User
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default UserForm;
