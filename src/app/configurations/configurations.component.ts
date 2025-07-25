import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigurationsService } from '../services/configurations.service';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { Subscription } from 'rxjs';
import { Input } from '@angular/core';
@Component({
  selector: 'app-configurations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './configurations.component.html',
  styleUrls: ['./configurations.component.css'] // Note: Changed to 'styleUrls'
})
export class ConfigurationsComponent implements OnInit, OnDestroy {
  apiEndpoints;
  selectedEndpoint: string;
  toggler:boolean = false;
  @Input() state:any
  private subscription: Subscription = new Subscription;
  private endpointActiveSubscription: Subscription = new Subscription;

  constructor(private configurationsService: ConfigurationsService) { 
    this.apiEndpoints = configurationsService.getApiEndpointsList();
    this.selectedEndpoint = configurationsService.getSelectedEndPoint();
  }

  ngOnInit() {
    this.subscription = this.configurationsService.selectedEndPoint$.subscribe(url => {
      this.selectedEndpoint = url;
    });
    this.endpointActiveSubscription = this.configurationsService.apiEndpointsList$.subscribe(list => {
      this.apiEndpoints = list;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }


  // updateSelectedEndpoint(url: string) {
  //   this.configurationsService.setEndPoint(url);
  //   this.selectedEndpoint = url;
  // }

  updateSelectedEndpoint(url: string) {
    this.configurationsService.setEndPoint(url);
  }

  toggleConfig() {
    // Implement any toggle functionality if needed
    this.toggler=!this.toggler;
    if (this.toggler){
    // this.configurationsService.getApiEndpointsState()
    this.configurationsService.getApiEndpointsState().subscribe(
      (endpoints) => {
        console.log('Received endpoints state:', endpoints);
        this.configurationsService.setEndpointsList(endpoints)
      },
      (error) => {
        console.error('Error fetching endpoints state:', error);
      }
    
    );
  }
  }
}
