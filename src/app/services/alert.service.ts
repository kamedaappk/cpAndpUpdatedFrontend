import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';



export interface Alert {
  message: string;
  type: 'success' | 'error' | 'warning';
}

@Injectable({
  providedIn: 'root'
})

export class AlertService {
  private alertSubject = new Subject<Alert>();
  alert$ = this.alertSubject.asObservable();

  showAlert(message: string, type: 'success' | 'error' | 'warning' = 'success') {
    this.alertSubject.next({ message, type });
  }
}
