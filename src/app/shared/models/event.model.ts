export interface EventModel {
  id: string;

  title: string;
  description: string;
  imageUrl?: string;

  startDate: string;
  endDate?: string;

  location: string;
  city: string;

  category: EventCategory;

  maxCapacity: number;
  subscribersCount?: number;
  isSubscribed?: boolean;

  cancelledAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export enum EventCategory {
  TECNOLOGIA = 'TECNOLOGIA',
  NEGOCIOS = 'NEGOCIOS',
  EDUCACAO = 'EDUCACAO',
  SAUDE = 'SAUDE',
  ENTRETENIMENTO = 'ENTRETENIMENTO',
  OUTROS = 'OUTROS',
}


export const createEmptyEvent = (): EventModel => ({
  id: '',
  title: '',
  description: '',
  imageUrl: undefined,

  startDate: new Date().toISOString(),
  endDate: undefined,

  location: '',
  city: '',
  category: undefined as any,

  maxCapacity: 0,
  subscribersCount: 0,

  isSubscribed: false,
  createdAt: '',
  updatedAt: ''
});

export interface ApiEvent {
  id: string;
  nome: string;
  descricao: string;
  imagem?: string;
  data: string;
  local: string;
  inscritos: number;
}
