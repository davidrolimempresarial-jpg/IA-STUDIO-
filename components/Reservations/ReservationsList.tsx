
import React, { useState, useMemo } from 'react';
import { Reservation, User } from '../../types';
import { Search, ChevronDown, ChevronUp, Clock, XCircle, Phone, Check, Ticket } from 'lucide-react';
import { api } from '../../services/api';

interface ReservationsListProps {
  reservations: Reservation[];
  currentUser: User;
  onUpdate: () => void;
  isLoading: boolean;
}

export const ReservationsList: React.FC<ReservationsListProps> = ({ reservations, currentUser, onUpdate, isLoading }) => {
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | number | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | number | null>(null);

  // Função para remover acentos e normalizar texto
  const normalizeText = (text: string) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  };

  // Função para pegar apenas dígitos do telefone
  const getDigits = (text: string) => text.replace(/\D/g, '');

  const filteredReservations = useMemo(() => {
    if (!search.trim()) return reservations;

    const term = normalizeText(search);
    const termDigits = getDigits(search);

    return reservations.filter(r => {
      const nomeMatch = normalizeText(r.nome || "").includes(term);
      const telefoneMatch = termDigits && getDigits(r.telefone || "").includes(termDigits);
      const codigoMatch = r.codigo_confirmacao && r.codigo_confirmacao.includes(term);

      return nomeMatch || telefoneMatch || codigoMatch;
    });
  }, [reservations, search]);

  const handleConfirmPix = async (id: string | number) => {
    setConfirmingId(id);
    try {
      const success = await api.confirmarPix(id, currentUser.email);
      if (success) {
        onUpdate();
      } else {
        alert('Erro ao confirmar PIX.');
      }
    } catch (e) {
      alert('Erro na operação.');
    } finally {
      setConfirmingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMADO':
        return (
          <span className="flex items-center gap-1.5 px-4 py-2 bg-green-500 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-green-100 animate-in fade-in zoom-in duration-300">
            <Check size={14} strokeWidth={3} /> CONFIRMADO
          </span>
        );
      case 'CANCELADO':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs font-bold uppercase tracking-wide">
            <XCircle size={12}/> Cancelado
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-bold uppercase tracking-wide">
            <Clock size={12}/> Pendente
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Barra de Busca sempre visível */}
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#FF6B00] transition-colors" size={20} />
        <input 
          type="text" 
          placeholder="Buscar por nome, telefone ou código..."
          className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-[#FF6B00] outline-none transition-all font-bold text-gray-700 placeholder:text-gray-300 placeholder:font-medium"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-28 bg-gray-50 rounded-3xl animate-pulse border border-gray-100"></div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
          {filteredReservations.length === 0 ? (
            <div className="p-20 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={24} className="text-gray-300" />
              </div>
              <p className="text-gray-400 font-bold">Nenhuma reserva encontrada para os critérios informados.</p>
              {search && (
                <button 
                  onClick={() => setSearch('')}
                  className="mt-4 text-[#FF6B00] text-sm font-black uppercase tracking-widest hover:underline"
                >
                  Limpar Busca
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {filteredReservations.map((res) => (
                <div key={res.id} className={`transition-all ${expandedId === res.id ? 'bg-orange-50/20' : 'hover:bg-gray-50/50'}`}>
                  <div 
                    className="p-6 flex flex-wrap items-center justify-between gap-4 cursor-pointer"
                    onClick={() => setExpandedId(expandedId === res.id ? null : res.id)}
                  >
                    <div className="flex items-center gap-5 flex-1 min-w-[280px]">
                      <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 text-center min-w-[75px]">
                        <span className="block text-[10px] text-[#FF6B00] font-black uppercase tracking-tighter">Hora</span>
                        <span className="text-xl font-black text-gray-900 leading-none">{res.hora}</span>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-black text-gray-900 text-lg leading-tight">{res.nome}</h4>
                          {res.codigo_confirmacao && (
                            <span className="px-2 py-0.5 bg-gray-900 text-white rounded-lg text-[10px] font-black tracking-widest flex items-center gap-1 shadow-sm">
                              <Ticket size={10} /> {res.codigo_confirmacao}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                          <span className="text-sm text-gray-500 flex items-center gap-1.5 font-bold">
                            <Phone size={14} className="text-[#FF6B00]"/> {res.telefone}
                          </span>
                          <span className="text-sm font-black text-gray-300 uppercase tracking-widest text-[10px]">
                            {res.qtd_pessoas} {res.qtd_pessoas === 1 ? 'PESSOA' : 'PESSOAS'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right hidden sm:block">
                         <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Total</p>
                         <p className="font-black text-gray-900 text-lg">R$ {Number(res.valor || 0).toFixed(2)}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        {getStatusBadge(res.status_pix)}
                        
                        {res.status_pix === 'PENDENTE' && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleConfirmPix(res.id); }}
                            disabled={confirmingId === res.id}
                            className="bg-gray-900 hover:bg-black text-white text-[10px] font-black px-4 py-3 rounded-xl transition-all shadow-lg shadow-gray-200 flex items-center gap-2 disabled:opacity-50 hover:scale-105 active:scale-95 uppercase tracking-widest"
                          >
                            {confirmingId === res.id ? '...' : 'CONFIRMAR PIX'}
                          </button>
                        )}
                      </div>

                      <div className={`transition-transform duration-300 text-gray-300 ${expandedId === res.id ? 'rotate-180 text-[#FF6B00]' : ''}`}>
                        <ChevronDown size={24} />
                      </div>
                    </div>
                  </div>

                  {expandedId === res.id && (
                    <div className="px-6 pb-8 pt-2 animate-in slide-in-from-top-2 duration-300">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-gray-100/50 pt-6">
                        <div className="bg-white/50 p-5 rounded-2xl border border-gray-100 md:col-span-1 shadow-sm">
                          <p className="text-[10px] font-black text-[#FF6B00] uppercase mb-2 tracking-widest">Observações do Cliente</p>
                          <p className="text-sm text-gray-700 font-medium italic leading-relaxed">
                            {res.observacao || 'Nenhuma observação especial informada para esta reserva.'}
                          </p>
                        </div>

                        <div className="bg-white p-5 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col justify-center items-center text-center shadow-sm">
                            <p className="text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Código Localizador</p>
                            <div className="flex items-center gap-2">
                              <Ticket size={20} className={res.codigo_confirmacao ? 'text-[#FF6B00]' : 'text-gray-200'} />
                              <p className={`text-3xl font-black ${res.codigo_confirmacao ? 'text-gray-900' : 'text-gray-200'}`}>
                                {res.codigo_confirmacao || '----'}
                              </p>
                            </div>
                            <p className="text-[9px] font-bold text-gray-400 mt-2 uppercase tracking-tighter">Dite este código para localizar rápido</p>
                        </div>
                        
                        {res.status_pix === 'CONFIRMADO' ? (
                          <div className="bg-green-500 p-5 rounded-2xl shadow-lg shadow-green-100 flex flex-col justify-center text-white">
                            <p className="text-[10px] font-black uppercase mb-3 tracking-widest opacity-80">Registro de Confirmação</p>
                            <div className="space-y-2">
                              <div className="flex flex-col">
                                <span className="text-[9px] font-black uppercase opacity-60">Data/Hora</span>
                                <span className="text-xs font-bold">{res.confirmado_em ? new Date(res.confirmado_em).toLocaleString('pt-BR') : '-'}</span>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[9px] font-black uppercase opacity-60">Atendente Responsável</span>
                                <span className="text-xs font-bold truncate">{res.confirmado_por || 'Sistema'}</span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 flex flex-col justify-center items-center text-center">
                            <Clock size={24} className="text-amber-400 mb-2" />
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-tight">Aguardando comprovante PIX para liberar código</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
