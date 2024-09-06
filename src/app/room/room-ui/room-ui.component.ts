import { Component, Input, OnInit } from '@angular/core';
import { RoomService } from '../room.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { text } from 'stream/consumers';
import { Console, timeStamp } from 'console';


@Component({
  selector: 'app-room-ui',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './room-ui.component.html',
  styleUrls: ['./room-ui.component.css']
})
export class RoomUiComponent implements OnInit{
  state:any;
  room:any;
  constructor(private roomService:RoomService){}
  roomData:any=[];
  username:string='';
  inputMessage:any='';
  messages:any;

  ngOnInit(): void {
    // Subscribe to state changes
    this.roomService.state$.subscribe(updatedState => {
      this.state = updatedState;
      console.log("state at ng", this.state)
    
    });

    this.roomService.room$.subscribe(updatedRoom => {
      this.room = updatedRoom;
      this.username=this.room.userId;
      console.log("room at ng", this.room)
      console.log("username at ng", this.username)
      this.messages=this.roomService.getRoomDataS(this.username)
      console.log("messages at ng", this.messages)
      // this.roomService.getRoomData(this.room.userId)
      });

    this.roomService.roomData$.subscribe(updatedRoomData =>{
      this.roomData = updatedRoomData
      // this.messages=this.roomData.messages
      console.log("roomData at ng", this.roomData)
      // console.log("messages at ng", this.messages)
      
    });

    // this.roomData=this.roomService.getRoomDetails(this.room.userId)
    // console.log("roomData", this.roomData)

  // this.roomData=this.roomService.getRoomDetails(this.room.userId)
  // this.roomService.getRoomDetails(this.room.userId)

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

  ngOnDestroy() {
    if (this.state.subscription) {
      this.state.subscription.unsubscribe();
    }
    if (this.room.subscription) {
      this.room.subscription.unsubscribe();
    }
    if (this.roomData.subscription) {
      this.roomData.subscription.unsubscribe();
    }
  }
}
