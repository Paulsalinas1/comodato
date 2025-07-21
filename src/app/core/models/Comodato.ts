export interface Comodato {
  idComodato?: string; 
  fechaInicioComodato: string;
  fechaTerminoComodatoD: string;
  estadoComodato: 'pendiente' | 'entregado' | 'devuelto' | 'cancelado';
  Persona_idPersona: string;
  r_establecimiento: string;
}