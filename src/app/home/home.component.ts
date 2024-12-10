import { CommonModule } from '@angular/common';
import { OnInit , Component } from '@angular/core';
import { RoomComponent } from "../room/room.component";
import { ConfigurationsComponent } from '../configurations/configurations.component';
import { AlertComponent } from "../alert/alert.component";
import { Store } from '@ngrx/store';
import { loadDeleteAll, loadResetAll, loadServers, setHomeScreenState } from './home.store.ts/home.action';
import { selectPageState } from './home.store.ts/home.selector';
import { AlertState, PageState } from './home.store.ts/home.state';
import { LoadingComponent } from '../loading/loading.component';

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

  constructor(
    private readonly store: Store
  ) { 
    this.store.select(selectPageState).subscribe((pageState) => {this.state = pageState;});
  }

  ngOnInit() {
    this.store.dispatch(loadServers())
  }

  createRoom() {
    this.store.dispatch(setHomeScreenState({pageState:'create'}))
  }

  enterRoom() {
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
    setTimeout(() => {
      this.showAlert = false;
    }, 2000);

  }
}
