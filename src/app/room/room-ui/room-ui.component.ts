import { Component, Input, OnInit } from '@angular/core';
import { RoomService } from '../room.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { text } from 'stream/consumers';
import { timeStamp } from 'console';


@Component({
  selector: 'app-room-ui',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './room-ui.component.html',
  styleUrls: ['./room-ui.component.css']
})
export class RoomUiComponent implements OnInit{
  state:any;
  @Input() room:any;
  constructor(private roomService:RoomService){}
  roomData:any;
  username:string='';
  inputMessage:any='';

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
  console.log("roomMessages", this.roomData.messages)
  }

  saveMessage(){
    console.log("message", this.inputMessage)
    // if message = '' avoid
    if(this.inputMessage==='') return;
    this.inputMessage = {
      text: this.inputMessage,
      timestamp: new Date().toISOString()}
    this.roomService.saveMessage(this.room.userId, this.inputMessage)
    this.inputMessage=''
  }

  fileUpload(event:any){
    // console.log("file", file)
    console.log("event", event)
    // const file = event.target.files[0];
    
  }

}
