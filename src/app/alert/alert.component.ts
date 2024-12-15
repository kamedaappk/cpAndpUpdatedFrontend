import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertService, Alert } from '../services/alert.service';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectError, selectInfo } from '../home/home.store.ts/home.selector';
import { setInfoNull } from '../home/home.store.ts/home.action';
@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css',
})
export class AlertComponent implements OnInit, OnDestroy {
  alert: Alert | null = null;
  private readonly subscription: Subscription;
  isVisible: boolean = false;

  constructor(private readonly alertService: AlertService, private readonly store: Store) {
    this.subscription = this.alertService.alert$.subscribe((alert) => {
      this.alert = alert;
      this.isVisible = true;

      // setTimeout(() => {
      //   this.isVisible = false;
      //   this.store.dispatch(setInfoNull())
      //   setTimeout(() => {
      //     this.alert = null;
      //   }, 300); // Time to wait for fade-out
      // }, 2000); // Hide after 2 seconds
    });
  }
  ngOnInit() {
    this.store.select(selectError).subscribe((error: any) => {
      if (error) {
        const type = 'error';
        this.alertService.showAlert(error.error.message, type );
      }
    })
    this.store.select(selectInfo).subscribe((info: any) => {
      if (info) {
        const type = 'info';
        this.alertService.showAlert(info, type);
      }
    })
  }


  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  // Function to close the alert
closeAlert(): void {
  this.isVisible = false; // Hide the alert
  // setTimeout(() => {
  //     this.alert = null; // Optionally reset the alert after fade out
  // }, 500); // Matches the CSS transition duration
}
}