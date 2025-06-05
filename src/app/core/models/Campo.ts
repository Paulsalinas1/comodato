export interface Campo {
  tipo: 'text' | 'textarea' | 'select';
  nombre: string;
  etiqueta: string;
  obligatorio: boolean;
  paso?: number;
  opciones?: { valor: any; texto: string }[];
}