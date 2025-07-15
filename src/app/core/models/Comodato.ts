export interface Comodato {
  idComodato?: string; 
  fechaInicioComodato: string; // formato 'YYYY-MM-DD'
  fechaTerminoComodatoD: string;
  estadoComodato: 'pendiente' | 'entregado' | 'devuelto' | 'cancelado';
  Persona_idPersona: string;
  r_establecimiento: string;
}