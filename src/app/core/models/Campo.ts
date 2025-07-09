export interface Campo {
  soloLectura: boolean;
  tipo: 'text' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'multiselect';
  nombre: string;
  etiqueta: string;
  obligatorio: boolean;
  paso?: number;
  opciones?: { valor: any; texto: string }[];
}