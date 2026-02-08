export interface EventModel {
  id: string;
  titulo: string;
  descricao: string;
  imagemUrl?: string;

  dataInicio: string;
  dataFim?: string;

  local: string;
  cidade: string;
  categoria?: string;

  lotacaoMax: number;
  inscritosCount: number;

  // 🔥 NOVOS CAMPOS
  isSubscribed?: boolean;
}


export const createEmptyEvent = (): EventModel => ({
  id: '',
  titulo: '',
  descricao: '',
  imagemUrl: undefined,

  dataInicio: new Date().toISOString(),
  dataFim: undefined,

  local: '',
  cidade: '',
  categoria: undefined,

  lotacaoMax: 0,
  inscritosCount: 0,

  isSubscribed: false
});

