import { CommonModule } from '@angular/common';
import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { RoomComponent } from "../room/room.component";
import { RoomUiComponent } from "../room/room-ui/room-ui.component";
import { RoomService } from '../room/room.service';
import { ConfigurationsComponent } from '../configurations/configurations.component';
import { AlertComponent } from "../alert/alert.component";
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RoomComponent, RoomUiComponent, ConfigurationsComponent, AlertComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  state:string = 'home'


  // Alerts

  showAlert: boolean = false;
  alertMessage: string = '';
  alertType: 'success' | 'error' | 'warning' = 'success';

  constructor(private roomService:RoomService){}

  ngOnInit(){
    // Subscribe to state changes
    this.roomService.state$.subscribe(updatedState => {
      this.state = updatedState;
    });
    
    // this.triggerAlert("Heyy", "success")
    this.state='home'
    console.log(this.state)
  }

  createRoom(){
    console.log('create room')
    // this.state='create'
    this.roomService.setState('create')
    console.log(this.state)
  }

  enterRoom(){
    console.log('enter room')
    // this.state='enter'
    this.roomService.setState('enter')
  }

  backToHome(){
    console.log('back to home')
    this.roomService.setState('home')
    location.reload(); // Reloads the entire application
    
  }

  resetAll(){
    console.log('reset all')
    this.roomService.resetAll()
  }
  deleteAll(){
    console.log('delete all')
    this.roomService.deleteAll()
  }
  triggerAlert(message: string,type: any) {
    console.log('trigger alert')
    this.alertMessage = message
    this.alertType = type // Change this as needed
    this.showAlert = true;
    setTimeout(() => {
      this.showAlert = false;
    }, 2000);
    
  }
}
