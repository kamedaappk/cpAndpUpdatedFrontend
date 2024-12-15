import { CommonModule } from '@angular/common';
import { OnInit , Component } from '@angular/core';
import { RoomComponent } from "../room/room.component";
import { ConfigurationsComponent } from '../configurations/configurations.component';
import { AlertComponent } from "../alert/alert.component";
import { Store } from '@ngrx/store';
import { loadDeleteAll, loadResetAll, LoadRoomByKey, loadServers, setHomeScreenState } from './home.store.ts/home.action';
import { selectPageState } from './home.store.ts/home.selector';
import { AlertState, PageState } from './home.store.ts/home.state';
import { LoadingComponent } from '../loading/loading.component';
import { ActivatedRoute, Router } from '@angular/router';
import { RoomService } from '../room/room.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RoomComponent, ConfigurationsComponent, AlertComponent, LoadingComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  state: PageState = 'home'
  showAlert: boolean = false;
  alertMessage: string = '';
  alertType: AlertState = 'success';
  roomKey: string | null = null;
  showRoomKeyEntry: boolean = false;  
  showPopup: boolean = false;
  constructor(
    private readonly store: Store,
    private readonly route: ActivatedRoute,
    private readonly roomService: RoomService,
    private readonly router: Router,
  ) { 
    this.store.select(selectPageState).subscribe((pageState) => {this.state = pageState;});
  }

  ngOnInit() {
    // this.store.dispatch(loadServers())
    this.roomKey = this.route.snapshot.paramMap.get('key');
    //console.log("roomKey", this.roomKey)
    if (this.roomKey) {
      this.showRoomKeyEntry = true;
      }else{
        this.showRoomKeyEntry = false;
      }

      
  }

  updateServers(){
    // ping every 15 seconds
    setInterval(() => {
      this.roomService.pingSerer().subscribe((res) => {
        //console.log("ping", res)
      })
    }, 15000);
  }

  createRoom() {
    this.updateServers()
    this.store.dispatch(setHomeScreenState({pageState:'create'}))
  }

  enterRoom() {
    this.updateServers()
    this.store.dispatch(setHomeScreenState({ pageState: 'enter' }))
  }

  backToHome() {
    this.store.dispatch(setHomeScreenState({ pageState: 'home' }))
  }

  resetAll() {
    this.store.dispatch(loadResetAll())
  }

  deleteAll() {
    this.store.dispatch(loadDeleteAll())
  }

  triggerAlert(message: string, type: any) {
    this.alertMessage = message
    this.alertType = type // Change this as needed
    this.showAlert = true;
    // setTimeout(() => {
    //   this.showAlert = false;
    // }, 2000);

  }

  onGoToRoomById(){
    this.showRoomKeyEntry = false
    this.updateServers()
    //console.log("roomKey", this.roomKey)
    this.store.dispatch(LoadRoomByKey({key: this.roomKey!}))
  }

  closePopup() {
    this.showRoomKeyEntry = false; // Close the popup when the user clicks the "No Thanks" or the close button
    //console.log("closePopup", this.showRoomKeyEntry)
    this.router.navigate(['/']); // Navigate to the home page or another route    
    
  }
}
