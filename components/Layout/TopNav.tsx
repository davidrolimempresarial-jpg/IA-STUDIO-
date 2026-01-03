
import React from 'react';
import { User } from '../../types';
import { LogOut, User as UserIcon, Calendar, PieChart, PlusCircle } from 'lucide-react';

interface TopNavProps {
  user: User;
  onLogout: () => void;
  currentView: 'list' | 'new' | 'dashboard';
  setView: (view: 'list' | 'new' | 'dashboard') => void;
}

export const TopNav: React.FC<TopNavProps> = ({ user, onLogout, currentView, setView }) => {
  return (
    <nav className="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('list')}>
          <div className="w-8 h-8 bg-orange-details rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">S</span>
          </div>
          <h1 className="text-xl font-semibold tracking-tight">Sabor & <span className="text-[#FF6B00]">Reserva</span></h1>
        </div>

        <div className="flex items-center bg-gray-50 p-1 rounded-xl">
          <button 
            onClick={() => setView('list')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${currentView === 'list' ? 'bg-white shadow-sm text-black font-medium' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Calendar size={18} />
            <span className="hidden sm:inline">Reservas</span>
          </button>
          
          <button 
            onClick={() => setView('dashboard')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${currentView === 'dashboard' ? 'bg-white shadow-sm text-black font-medium' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <PieChart size={18} />
            <span className="hidden sm:inline">Dashboard</span>
          </button>

          {user.role === 'ADMIN' && (
            <button 
              onClick={() => setView('new')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${currentView === 'new' ? 'bg-white shadow-sm text-black font-medium' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <PlusCircle size={18} />
              <span className="hidden sm:inline">Nova Reserva</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
            <UserIcon size={14} className="text-[#FF6B00]" />
            <span className="font-medium">{user.name}</span>
            <span className="text-[10px] bg-orange-100 text-[#FF6B00] px-1.5 py-0.5 rounded uppercase font-bold">
              {user.role}
            </span>
          </div>
          <button 
            onClick={onLogout}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            title="Sair"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
};
