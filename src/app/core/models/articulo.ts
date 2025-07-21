export interface Articulo {
  idArticulo?: string;
  nombreArticulo: string;
  desArticulo?: string;
  estadoArticulo: 'FUNCIONAL' | 'MANTENIMIENTO' | 'DEFECTUOSO' | 'PERDIDO' | 'ROBADO' | 'DANADO';
  dispArticulo: 'DISPONIBLE' | 'EN_COMODATO' | 'RESERVADO' | 'NO_DISPONIBLE';
  numSerieArticulo: string;
  Marca_idMarca: string;
  Categoria_idCategoria: string;
  Modelo_idModelo: string;
}
