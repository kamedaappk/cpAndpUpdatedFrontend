import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigurationsService } from '../services/configurations.service';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { Subscription } from 'rxjs';
import { Input } from '@angular/core';
import { RoomService } from '../room/room.service';
import { ChangelogComponent } from '../changelog/changelog.component';
@Component({
  selector: 'app-configurations',
  standalone: true,
  imports: [CommonModule, FormsModule, ChangelogComponent],
  templateUrl: './configurations.component.html',
  styleUrls: ['./configurations.component.css'] // Note: Changed to 'styleUrls'
})
export class ConfigurationsComponent implements OnInit, OnDestroy {
  apiEndpoints;
  selectedEndpoint: string;
  selectedEndpointTitle: string;
  toggler: boolean = false;
  roomList: any;
  maxUploadSize: number;
  maxUploadSizeInMB: number;
  private maxUploadSizeSubscription: Subscription = new Subscription();

  // Get the latest version from changelog
  get latestVersion(): string {
    const changelog = new ChangelogComponent().changelog;
    if (changelog && changelog.length > 0) {
      const latestEntry = changelog[0]; // First entry is the latest
      // Format the date as vYYYY.MM.DD
      return `v${latestEntry.date.replace(/-/g, '.')}`;
    }
    return 'vUnknown';
  }

  @Input() state: any
  private subscription: Subscription = new Subscription;
  private endpointActiveSubscription: Subscription = new Subscription;

  constructor(
    private configurationsService: ConfigurationsService,
    private roomService: RoomService,
  ) {
    this.apiEndpoints = configurationsService.getApiEndpointsList();
    this.selectedEndpoint = configurationsService.getSelectedEndPoint();
    // Find the title of the initially selected endpoint
    const initialEndpoint = configurationsService.getApiEndpointsList().find(e => e.url === this.selectedEndpoint);
    this.selectedEndpointTitle = initialEndpoint ? initialEndpoint.title : this.selectedEndpoint;
    this.maxUploadSize = configurationsService.getMaxUploadSize();
    this.maxUploadSizeInMB = this.maxUploadSize / (1024 * 1024);
  }

  ngOnInit() {
    this.subscription = this.configurationsService.selectedEndPoint$.subscribe(url => {
      this.selectedEndpoint = url;
      // Find the title of the selected endpoint
      const endpoint = this.apiEndpoints.find(e => e.url === url);
      this.selectedEndpointTitle = endpoint ? endpoint.title : url;
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
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.endpointActiveSubscription) {
      this.endpointActiveSubscription.unsubscribe();
    }
    if (this.maxUploadSizeSubscription) {
      this.maxUploadSizeSubscription.unsubscribe();
    }
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
