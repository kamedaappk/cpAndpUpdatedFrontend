import { CommonModule } from '@angular/common';
import { OnInit , Component } from '@angular/core';
import { RoomComponent } from "../room/room.component";
import { ConfigurationsComponent } from '../configurations/configurations.component';
import { AlertComponent } from "../alert/alert.component";
import { Store } from '@ngrx/store';

import { LoadingComponent } from '../loading/loading.component';
import { ActivatedRoute, Router } from '@angular/router';
import { RoomService } from '../room/room.service';
import { selectPageState } from '../home/home.store.ts/home.selector';
import { PageState, AlertState } from '../home/home.store.ts/home.state';
import { addMessage } from '../room/room-ui/room-ui.store/room-ui.actions';
import { AdminService } from './adminService.ts/admin.service';
import { ConfigurationsService } from '../services/configurations.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RoomComponent, ConfigurationsComponent, AlertComponent, LoadingComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  roomDatas : any;
  state:any;
  combinedRoomData: any[] = [];
  roomDetails: any;
  rooms: any;
  backendSubscription: any;

  constructor(
    private readonly store: Store,
    private readonly route: ActivatedRoute,
    private readonly roomService: RoomService,
    private readonly adminService: AdminService,
    private readonly router: Router,
    private readonly configurationsService: ConfigurationsService,
  ) { 
    this.backendSubscription = this.configurationsService.selectedEndPoint$.subscribe((url: any) => {
      console.log("URL Changed To", url);
      this.fetchData()})

    this.store.select(selectPageState).subscribe((pageState) => {this.state = pageState;});
  }

  ngOnInit() {
      
    
  }

  fetchData() {
    this.adminService.getRoomDatas().subscribe((response: any) => {
      this.roomDetails = response.roomDetails;
      this.rooms = response.rooms;
      console.log("Response Data", response);
    });
    this.combineRoomData();
  }
  
  formatTimestamp(timestamp: number): string {
    // Convert timestamp to a readable date
    const date = new Date(timestamp);
    return date.toLocaleString();
  }

  combineRoomData() {
    // Merging data from rooms and roomDetails
    this.combinedRoomData = this.roomDetails?.map((detail: { id: any; }) => {
      const room = this.rooms.find((r: { id: any; }) => r.id === detail.id);
      return {
        ...detail,
        duration: room ? room.duration : null,
        key: room ? room.key : null
      };
    });
  }
}
