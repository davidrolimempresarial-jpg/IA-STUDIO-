
import React from 'react';
import { DashboardData } from '../../types';
import { Users, CheckCircle, Clock, Banknote } from 'lucide-react';

interface DashboardSummaryProps {
  data: DashboardData;
  isLoading: boolean;
}

export const DashboardSummary: React.FC<DashboardSummaryProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-gray-50 h-32 rounded-2xl border border-gray-100"></div>
        ))}
      </div>
    );
  }

  const cards = [
    { label: 'Total Reservas', value: data.totalReservas, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Confirmadas', value: data.totalConfirmadas, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Total R$ Recebido', value: `R$ ${data.valorTotalConfirmado.toFixed(2)}`, icon: Banknote, color: 'text-[#FF6B00]', bg: 'bg-orange-50' },
    { label: 'Pendentes', value: data.totalPendentes, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, idx) => (
        <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className={`p-2 rounded-xl ${card.bg}`}>
              <card.icon size={24} className={card.color} />
            </div>
          </div>
          <p className="text-sm text-gray-500 font-medium mb-1 uppercase tracking-wider">{card.label}</p>
          <h3 className="text-3xl font-bold text-gray-900">{card.value}</h3>
        </div>
      ))}
    </div>
  );
};
