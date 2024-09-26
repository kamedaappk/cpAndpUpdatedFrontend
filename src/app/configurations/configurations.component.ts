import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigurationsService } from '../services/configurations.service';

@Component({
  selector: 'app-confiurations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './configurations.component.html',
  styleUrl: './configurations.component.css'
})
export class ConfigurationsComponent {
  apiEndpoints ;

  constructor(private configurationsService: ConfigurationsService) { 
    this.apiEndpoints = configurationsService.getApiEndpointsList();
  }



}
