import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserProfile, UserRole } from '../types';
import { logoutUser } from '../services/authService';
import { LogOut, User, Shield, CheckCircle, Clock, LayoutDashboard, Settings, ChevronDown, GraduationCap } from 'lucide-react';

interface NavbarProps {
  user: UserProfile | null;
}

const Navbar: React.FC<NavbarProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    navigate('/login');
  };

  const avatarUrl = user 
    ? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=4F46E5&color=fff&bold=true&rounded=true`
    : 'https://ui-avatars.com/api/?name=U';

  return (
    <nav className="glass fixed top-0 w-full z-[100] px-4 md:px-12 py-4 flex justify-between items-center shadow-lg border-b border-white/20">
      <Link to="/" className="flex items-center gap-3 group">
        <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-indigo-200 shadow-xl group-hover:rotate-12 transition-all duration-500">
          <GraduationCap className="w-6 h-6" />
        </div>
        <span className="text-2xl font-black text-gray-900 tracking-tighter">Sikkha48</span>
      </Link>

      <div className="flex items-center gap-6">
        {user ? (
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-3 bg-white/40 hover:bg-white/80 transition-all rounded-2xl p-1 pr-4 border border-white/60 shadow-sm"
            >
              <img src={avatarUrl} alt="Avatar" className="w-9 h-9 rounded-xl shadow-md" />
              <div className="hidden sm:flex flex-col items-start leading-tight">
                <span className="font-bold text-gray-900 text-xs truncate max-w-[80px]">{user.username}</span>
                <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-wider">
                  {user.role}
                </span>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
              <div className="absolute right-0 mt-3 w-72 glass rounded-[2rem] shadow-2xl overflow-hidden border border-white animate-slide-up">
                <div className="p-6 border-b border-gray-100 bg-white/50">
                  <p className="font-black text-gray-900 text-lg truncate">{user.username}</p>
                  <p className="text-xs text-gray-400 font-medium truncate">{user.email}</p>
                  
                  <div className="flex flex-col gap-2 mt-4">
                    <div className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase flex items-center gap-2 border ${user.isApproved ? 'bg-green-50 text-green-700 border-green-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
                      {user.isApproved ? <CheckCircle className="w-3 h-3"/> : <Clock className="w-3 h-3"/>}
                      {user.isApproved ? 'Verified Access' : 'Approval Pending'}
                    </div>
                  </div>
                </div>
                
                <div className="p-2 space-y-1">
                  <Link 
                    to="/" 
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-indigo-600 hover:text-white rounded-xl transition-all font-bold group"
                  >
                    <LayoutDashboard className="w-4 h-4 text-indigo-500 group-hover:text-white" /> Dashboard
                  </Link>
                  {user.role === UserRole.ADMIN && (
                    <Link 
                      to="/admin" 
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-purple-600 hover:text-white rounded-xl transition-all font-bold group"
                    >
                      <Settings className="w-4 h-4 text-purple-500 group-hover:text-white" /> Management
                    </Link>
                  )}
                  <div className="h-px bg-gray-100/50 my-1 mx-2"></div>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-600 hover:text-white rounded-xl transition-all font-bold text-left group"
                  >
                    <LogOut className="w-4 h-4 group-hover:text-white" /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg transition-transform active:scale-95 text-sm uppercase tracking-wider">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;