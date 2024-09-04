import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RoomComponent } from "../room/room.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RoomComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  state:string= 'home'

  createRoom(){
    console.log('create room')
    this.state='create'
  }

  enterRoom(){
    console.log('enter room')
    this.state='enter'
  }

  backToHome(){
    console.log('back to home')
    this.state='home'
  }
}
