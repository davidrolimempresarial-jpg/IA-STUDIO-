
export type StatusPix = 'PENDENTE' | 'CONFIRMADO' | 'CANCELADO';

export type UserRole = 'ADMIN' | 'STAFF';

export interface User {
  email: string;
  role: UserRole;
  name: string;
}

export interface Reservation {
  id: string | number;
  data: string; // YYYY-MM-DD
  hora: string; // HH:mm
  nome: string;
  telefone: string;
  qtd_pessoas: number;
  observacao?: string;
  status_pix: StatusPix;
  valor: number;
  confirmado_em?: string; // ISO datetime
  confirmado_por?: string; // User email
  codigo_confirmacao?: string; // Código de busca rápida (Ex: SR-X1Y2Z3)
}

export interface DashboardData {
  totalReservas: number;
  totalConfirmadas: number;
  valorTotalConfirmado: number;
  totalPendentes: number;
}
