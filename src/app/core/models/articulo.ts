export interface Articulo {
  idArticulo?: string;  // Opcional al crear, porque lo genera el backend
  nombreArticulo: string;
  desArticulo?: string;
  estadoArticulo: 'FUNCIONAL' | 'MANTENIMIENTO' | 'DEFECTUOSO';
  dispArticulo: 'DISPONIBLE' | 'EN_COMODATO' | 'RESERVADO';
  numSerieArticulo: string;
  Marca_idMarca: string;
  Categoria_idCategoria: string;
  Modelo_idModelo: string;
}
