import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ModalService {
  private _modalActivo = new BehaviorSubject<boolean>(false);
  modalActivo$ = this._modalActivo.asObservable();

  activarModal() {
    this._modalActivo.next(true);
  }

  desactivarModal() {
    this._modalActivo.next(false);
  }
}