
import { Reservation, DashboardData } from '../types';

const API_BASE_URL = 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec';
const IS_MOCK = API_BASE_URL.includes('YOUR_DEPLOYMENT_ID');
const LOCAL_STORAGE_KEY = 'sabor_reserva_db';

const getLocalData = (): Reservation[] => {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

const saveLocalData = (data: Reservation[]) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
};

// Função auxiliar para gerar um código numérico simples de 4 dígitos
const generateLocator = () => {
  // Gera um número entre 1000 e 9999
  return Math.floor(1000 + Math.random() * 9000).toString();
};

export const api = {
  getReservas: async (data: string): Promise<Reservation[]> => {
    if (IS_MOCK) {
      return getLocalData().filter(r => r.data === data);
    }
    try {
      const response = await fetch(`${API_BASE_URL}?action=getReservas&data=${data}`);
      if (!response.ok) throw new Error('Falha ao buscar reservas');
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error(error);
      return [];
    }
  },

  createReserva: async (reserva: Partial<Reservation>): Promise<Reservation> => {
    if (IS_MOCK) {
      const db = getLocalData();
      const newReserva = {
        ...reserva,
        id: Date.now(),
        qtd_pessoas: Number(reserva.qtd_pessoas),
        valor: Number(reserva.valor),
        status_pix: 'PENDENTE'
      } as Reservation;
      db.push(newReserva);
      saveLocalData(db);
      return newReserva;
    }
    try {
      const response = await fetch(`${API_BASE_URL}`, {
        method: 'POST',
        body: JSON.stringify({ action: 'createReserva', ...reserva }),
      });
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  confirmarPix: async (id: string | number, userEmail: string): Promise<boolean> => {
    if (IS_MOCK) {
      const db = getLocalData();
      const index = db.findIndex(r => String(r.id) === String(id));
      if (index !== -1) {
        db[index].status_pix = 'CONFIRMADO';
        db[index].confirmado_em = new Date().toISOString();
        db[index].confirmado_por = userEmail;
        db[index].codigo_confirmacao = generateLocator(); // Código simples de 4 dígitos
        saveLocalData(db);
        return true;
      }
      return false;
    }
    try {
      const response = await fetch(`${API_BASE_URL}`, {
        method: 'POST',
        body: JSON.stringify({ action: 'confirmarPix', id, email: userEmail }),
      });
      return response.ok;
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  getDashboard: async (data: string): Promise<DashboardData> => {
    if (IS_MOCK) {
      const allReservations = getLocalData();
      const daily = allReservations.filter(r => r.data === data);
      const confirmadas = daily.filter(r => r.status_pix === 'CONFIRMADO');
      
      return {
        totalReservas: daily.length,
        totalConfirmadas: confirmadas.length,
        valorTotalConfirmado: confirmadas.reduce((acc, r) => acc + (Number(r.valor) || 0), 0),
        totalPendentes: daily.filter(r => r.status_pix === 'PENDENTE').length
      };
    }
    try {
      const response = await fetch(`${API_BASE_URL}?action=getDashboard&data=${data}`);
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error(error);
      return { totalReservas: 0, totalConfirmadas: 0, valorTotalConfirmado: 0, totalPendentes: 0 };
    }
  }
};
