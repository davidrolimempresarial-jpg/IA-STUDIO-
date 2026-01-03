
import React, { useState, useEffect, useCallback } from 'react';
import { User, Reservation, DashboardData } from './types';
import { TopNav } from './components/Layout/TopNav';
import { ReservationForm } from './components/Reservations/ReservationForm';
import { ReservationsList } from './components/Reservations/ReservationsList';
import { DashboardSummary } from './components/Dashboard/DashboardSummary';
import { api } from './services/api';
import { LogIn, Lock, Mail, RefreshCw } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<'list' | 'new' | 'dashboard'>('list');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalReservas: 0,
    totalConfirmadas: 0,
    valorTotalConfirmado: 0,
    totalPendentes: 0
  });
  const [isLoading, setIsLoading] = useState(false);

  // Authentication logic (Mock)
  const [loginEmail, setLoginEmail] = useState('');
  const [loginRole, setLoginRole] = useState<'ADMIN' | 'STAFF'>('STAFF');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail) return alert('Por favor, informe um email.');
    
    setUser({
      email: loginEmail,
      name: loginEmail.split('@')[0],
      role: loginRole
    });
  };

  const handleLogout = () => {
    setUser(null);
    setView('list');
  };

  const fetchData = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const [resData, dashData] = await Promise.all([
        api.getReservas(selectedDate),
        api.getDashboard(selectedDate)
      ]);
      
      setReservations(resData);
      setDashboardData(dashData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user, selectedDate]);

  // Atualiza sempre que mudar a data ou o usuário logar
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Força atualização ao entrar no Dashboard ou Lista de Reservas
  useEffect(() => {
    if (view === 'dashboard' || view === 'list') {
      fetchData();
    }
  }, [view, fetchData]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 p-10">
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 bg-[#FF6B00] rounded-2xl flex items-center justify-center shadow-lg shadow-orange-100 mb-6">
              <span className="text-white font-black text-4xl italic">S</span>
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Sabor & <span className="text-[#FF6B00]">Reserva</span></h1>
            <p className="text-gray-400 font-medium mt-2">Acesse sua conta para gerenciar</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input 
                  type="email" 
                  required
                  placeholder="seu@email.com"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent outline-none transition-all font-bold text-gray-900 placeholder:text-gray-300"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Perfil de Acesso</label>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  type="button"
                  onClick={() => setLoginRole('STAFF')}
                  className={`py-4 rounded-2xl font-bold border-2 transition-all flex flex-col items-center gap-1 ${loginRole === 'STAFF' ? 'border-[#FF6B00] bg-orange-50 text-[#FF6B00]' : 'border-gray-100 text-gray-400 hover:border-gray-200'}`}
                >
                  <span className="text-lg">STAFF</span>
                </button>
                <button 
                  type="button"
                  onClick={() => setLoginRole('ADMIN')}
                  className={`py-4 rounded-2xl font-bold border-2 transition-all flex flex-col items-center gap-1 ${loginRole === 'ADMIN' ? 'border-[#FF6B00] bg-orange-50 text-[#FF6B00]' : 'border-gray-100 text-gray-400 hover:border-gray-200'}`}
                >
                  <span className="text-lg">ADMIN</span>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input 
                  type="password" 
                  disabled
                  placeholder="•••••••• (Apenas demo)"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 outline-none cursor-not-allowed opacity-60 text-gray-900 font-bold placeholder:text-gray-300"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-gray-900 hover:bg-black text-white font-black py-5 rounded-2xl shadow-xl shadow-gray-200 transition-all flex items-center justify-center gap-3 mt-4"
            >
              ENTRAR <LogIn size={20} />
            </button>
          </form>
          
          <p className="text-center text-xs text-gray-300 mt-10">
            v1.0.0 &copy; 2024 Sabor & Reserva
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <TopNav user={user} onLogout={handleLogout} currentView={view} setView={setView} />

      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                {view === 'new' ? 'Nova Reserva' : view === 'dashboard' ? 'Painel de Controle' : 'Reservas do Dia'}
              </h2>
              <p className="text-gray-500 font-medium mt-1">Gerencie seu restaurante com facilidade</p>
            </div>
            {isLoading && <RefreshCw size={20} className="text-[#FF6B00] animate-spin ml-2" />}
          </div>

          <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
            <span className="text-sm font-bold text-gray-400 uppercase tracking-widest pl-2">Filtrar Data:</span>
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 rounded-xl border-none bg-gray-50 focus:ring-2 focus:ring-[#FF6B00] outline-none transition-all font-bold text-gray-700"
            />
          </div>
        </div>

        {view === 'dashboard' && (
          <DashboardSummary data={dashboardData} isLoading={isLoading} />
        )}

        {view === 'list' && (
          <ReservationsList 
            reservations={reservations} 
            currentUser={user} 
            onUpdate={fetchData} 
            isLoading={isLoading} 
          />
        )}

        {view === 'new' && user.role === 'ADMIN' && (
          <ReservationForm onSuccess={() => { setView('list'); fetchData(); }} />
        )}
      </main>

      <footer className="py-12 text-center">
        <p className="text-gray-300 text-sm font-medium">Sabor & Reserva &bull; Gestão Minimalista de Restaurante</p>
      </footer>
    </div>
  );
};

export default App;
