import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date().toLocaleString('id-ID'));

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleString('id-ID'));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm py-4 px-6 flex justify-between items-center ml-64 z-10 print:hidden">
      <div className="flex items-center gap-3">
        <img src="/logo_pcs.png" alt="Logo PT" className="h-8 w-auto object-contain rounded-md" />
        <h1 className="text-xl font-bold text-gray-800">PT. Pandu Cipta Solusi</h1>
      </div>
      <div className="flex items-center gap-6">
        <span className="text-sm text-gray-500 font-medium">{time}</span>
        <div className="flex items-center gap-3 border-l pl-6 border-gray-200">
          <div className="text-right">
            <p className="text-sm font-bold text-gray-800">{user?.nama}</p>
            <p className="text-xs text-gray-500">{user?.role}</p>
          </div>
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
            <User size={20} />
          </div>
          <button onClick={handleLogout} className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors ml-2" title="Logout">
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
