
import React, { useState } from 'react';
import { api } from '../../services/api';

interface ReservationFormProps {
  onSuccess: () => void;
}

const INITIAL_STATE = {
  data: new Date().toISOString().split('T')[0],
  hora: '19:00',
  nome: '',
  telefone: '',
  qtd_pessoas: 2,
  observacao: ''
};

export const ReservationForm: React.FC<ReservationFormProps> = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(INITIAL_STATE);

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 11) {
      return digits
        .replace(/^(\d{2})(\d)/g, '($1) $2')
        .replace(/(\d)(\d{4})$/, '$1-$2');
    }
    return value.substring(0, 15);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'telefone' ? formatPhone(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const qtd = Number(formData.qtd_pessoas);
    if (qtd < 1) return alert('Quantidade de pessoas deve ser pelo menos 1');
    
    setLoading(true);
    try {
      await api.createReserva({
        ...formData,
        qtd_pessoas: qtd,
        status_pix: 'PENDENTE',
        valor: qtd * 10
      });
      
      // Limpa o formulário
      setFormData(INITIAL_STATE);
      
      alert('Reserva criada com sucesso!');
      onSuccess();
    } catch (error) {
      alert('Erro ao criar reserva. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-gray-100 shadow-xl p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Nova Reserva</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Data *</label>
            <input 
              type="date" 
              name="data"
              required
              value={formData.data}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Hora *</label>
            <input 
              type="time" 
              name="hora"
              required
              value={formData.hora}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Nome do Cliente *</label>
          <input 
            type="text" 
            name="nome"
            required
            placeholder="Ex: João da Silva"
            value={formData.nome}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent outline-none transition-all"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Telefone *</label>
            <input 
              type="text" 
              name="telefone"
              required
              placeholder="(00) 00000-0000"
              value={formData.telefone}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Qtd. Pessoas *</label>
            <div className="relative">
              <input 
                type="number" 
                name="qtd_pessoas"
                required
                min="1"
                value={formData.qtd_pessoas}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent outline-none transition-all"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">
                x R$ 10,00
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Observação (Opcional)</label>
          <textarea 
            name="observacao"
            rows={3}
            placeholder="Alguma restrição ou pedido especial?"
            value={formData.observacao}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent outline-none transition-all resize-none"
          />
        </div>

        <div className="pt-4 border-t border-gray-50">
          <div className="flex justify-between items-center mb-6">
            <span className="text-gray-500 font-medium">Total Estimado:</span>
            <span className="text-3xl font-black text-gray-900">R$ {(Number(formData.qtd_pessoas) * 10).toFixed(2)}</span>
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[#FF6B00] hover:bg-[#e65a00] text-white font-bold py-4 rounded-2xl shadow-lg shadow-orange-200 transition-all disabled:opacity-50 flex justify-center items-center"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : 'CRIAR RESERVA'}
          </button>
        </div>
      </form>
    </div>
  );
};
