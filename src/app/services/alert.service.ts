import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AlertState } from '../home/home.store.ts/home.state';

export interface Alert {
  message: string;
  type: AlertState;
}
@Injectable({
  providedIn: 'root'
})

export class AlertService {
  private readonly alertSubject = new Subject<Alert>();
  alert$ = this.alertSubject.asObservable();

  showAlert(message: string, type: AlertState = 'success') {
    this.alertSubject.next({ message, type });
  }
}
