import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { RoomService } from '../room.service';

@Component({
  selector: 'app-room-ui',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './room-ui.component.html',
  styleUrl: './room-ui.component.css'
})
export class RoomUiComponent implements OnInit{
  state:any;
  @Input() room:any;
  constructor(private roomService:RoomService){}
  roomData:any;
  username:string='';

  ngOnInit(): void {
    // Subscribe to state changes
    this.roomService.state$.subscribe(updatedState => {
      this.state = updatedState;
    });

  console.log("state",this.state)
  console.log("room", this.room)
  console.log("userId", this.room.userId)
  this.roomData=this.roomService.getRoomDetails(this.room.userId)
  console.log("roomData", this.roomData)
  }

}
