import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms'; // Import ReactiveFormsModule
import { RoomService } from './room.service';
import { RoomUiComponent } from './room-ui/room-ui.component';
@Component({
  selector: 'app-room',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RoomUiComponent],
  templateUrl: './room.component.html',
  styleUrl: './room.component.css'
})
export class RoomComponent implements OnInit {
  // @Input() roomName!: string;
  state:any;

  selectedRoom:any;
  createForm!: FormGroup; // Use '!' to assert that this will be initialized
  enterForm!: FormGroup;
  roomList:any;


  constructor(private fb: FormBuilder, private roomService:RoomService) {}
  ngOnInit() {
    // Subscribe to state changes
    this.roomService.state$.subscribe(updatedState => {
      this.state = updatedState;
    });

    this.roomService.room$.subscribe(updatedRoom => {
      this.selectedRoom = updatedRoom;
    })

    this.createForm = this.fb.group({
      roomName: ['', Validators.required],
      description: ['']
    });

    this.enterForm = this.fb.group({
      roomId: ['', Validators.required]
    });
  }

  onCreate() {
    if (this.createForm.valid) {
      // Handle the creation of the room
      console.log('Creating room with data:', this.createForm.value);
      console.log('Room ID', this.createForm.value.roomName)
      
      this.roomService.createRoom(this.createForm.value.roomName);
    }
  }

  onEnter() {
    if (this.enterForm.valid) {
      // Handle entering the room
      console.log('Entering room with ID:', this.enterForm.value.roomId);
      this.selectedRoom=this.roomService.enterRoom(this.enterForm.value.roomId);
      console.log('selected Room',this.selectedRoom)
      if (this.selectedRoom!=null){
      // this.state='loggedin'
      console.log('Logged In')
      this.roomService.setState('loggedin')
      this.roomService.setRoom(this.selectedRoom)
      // return this.selectedRoom
      }
    }
  }

  getRoomList() {
    // this.roomList = this.roomService.getRooms().subscribe((data) => {
    //   this.roomList = data;
    //   console.log(this.roomList)
    // });
    this.roomList = this.roomService.getRooms();
    console.log("Room List",this.roomList)
  }

  ngOnDestroy(): void {}
  // unsubscribe
  // this.roomservice.state$.unsubscribe();
  // this.roomservice.room$.unsubscribe();


}
