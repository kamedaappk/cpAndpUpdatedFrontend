import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigurationsService } from '../services/configurations.service';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { Subscription } from 'rxjs';
import { Input } from '@angular/core';
import { RoomService } from '../room/room.service';
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
  toggler: boolean = false;
  roomList: any;
  maxUploadSize: number;
  maxUploadSizeInMB: number;
  private maxUploadSizeSubscription: Subscription = new Subscription();

  @Input() state: any
  private subscription: Subscription = new Subscription;
  private endpointActiveSubscription: Subscription = new Subscription;

  constructor(
    private configurationsService: ConfigurationsService,
    private roomService: RoomService,
  ) {
    this.apiEndpoints = configurationsService.getApiEndpointsList();
    this.selectedEndpoint = configurationsService.getSelectedEndPoint();
    this.maxUploadSize = configurationsService.getMaxUploadSize();
    this.maxUploadSizeInMB = this.maxUploadSize / (1024 * 1024);
  }

  ngOnInit() {
    this.subscription = this.configurationsService.selectedEndPoint$.subscribe(url => {
      this.selectedEndpoint = url;
    });
    this.endpointActiveSubscription = this.configurationsService.apiEndpointsList$.subscribe(list => {
      this.apiEndpoints = list;
    });
    this.maxUploadSizeSubscription = this.configurationsService.maxUploadSize$.subscribe(size => {
      this.maxUploadSize = size;
      this.maxUploadSizeInMB = size / (1024 * 1024);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }


  updateSelectedEndpoint(url: string) {
    this.configurationsService.setEndPoint(url);
  }

  toggleConfig() {
    // Implement any toggle functionality if needed
    console.log('Config toggled');
    this.toggler = !this.toggler;
    if (this.toggler) {
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
  resetAll() {
    console.log('reset all')
    this.roomService.resetAll()
  }

  getRoomList() {

    this.roomService.getRooms().subscribe({
      next: (data: any) => {
        this.roomList = data;
        console.log("Room List is", this.roomList)
      },
      error: (err: any) => {
        console.error('Error fetching rooms:', err);
      }
    });
  }

  onMaxUploadSizeChange(): void {
    const sizeInBytes = this.maxUploadSizeInMB * 1024 * 1024;
    this.configurationsService.setMaxUploadSize(sizeInBytes);
  }

  onMaxUploadSizeInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.maxUploadSizeInMB = Number(target.value);
  }

}
