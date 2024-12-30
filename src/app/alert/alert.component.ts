import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertService, Alert } from '../services/alert.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css',
})
export class AlertComponent implements OnInit, OnDestroy {
  alert: Alert | null = null;
  private subscription: Subscription;
  isVisible: boolean = false;

  constructor(private alertService: AlertService) {
    this.subscription = this.alertService.alert$.subscribe((alert) => {
      this.alert = alert;
      this.isVisible = true;

      // setTimeout(() => {
      //   this.isVisible = false;
      //   setTimeout(() => {
      //     this.alert = null;
      //   }, 300); // Time to wait for fade-out
      // }, 2000); // Hide after 2 seconds
    });
  }


  ngOnInit() {}


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