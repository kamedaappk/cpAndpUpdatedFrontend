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
      description: [''],
      duration: ['',
          Validators.required,
        ]
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
      // console.log('Room Name', this.createForm.value.duration)

      // set time = current time + duration
      this.createForm.value.duration = new Date().getTime() + this.createForm.value.duration * 60000;
      console.log('Duration', this.createForm.value.duration)
      // set time = current time
      // this.createForm.value.duration = new Date();
      this.roomService.createRoom(this.createForm.value.roomName, this.createForm.value.duration);
      this.selectedRoom=this.roomService.enterRoom(this.createForm.value.roomName);
      console.log('selected Room at room component on create', this.selectedRoom)
      this.roomService.setState('loggedin')
      this.roomService.setRoom(this.selectedRoom)
      this.roomService.setRoomData(this.selectedRoom.userId)

      
    }
  }

  onEnter() {
    if (this.enterForm.valid) {
      // Handle entering the room
      console.log('Entering room with ID:', this.enterForm.value.roomId);
      this.selectedRoom=this.roomService.enterRoom(this.enterForm.value.roomId);
      this.roomService.updateTime()
      if(this.selectedRoom!=null){
      this.roomService.setState('loggedin')
      this.roomService.setRoom(this.selectedRoom)
      this.roomService.setRoomData(this.selectedRoom.userId)

      }
      
      // this.roomService.setRoom(this.selectedRoom);
      // console.log('selected Room at room component on enter', this.selectedRoom)
      // console.log('selected Room',this.selectedRoom)
      // if (this.selectedRoom!=null){
      // this.state='loggedin'
      // console.log('Logged In')
      // this.roomService.setState('loggedin')
      // this.roomService.setRoom(this.selectedRoom)
      // this.roomService.setRoomData(this.selectedRoom.userId)
      // return this.selectedRoom
      // }
    }
  }
  

  getRoomList() {

    this.roomService.getRooms().subscribe({
      next: (data: any) => {
        this.roomList = data;
        console.log("Room List is", this.roomList)
      },
      error: (err: any) => {
        console.error('Error fetching rooms:', err);      }
    });
  }

  ngOnDestroy() {
    if (this.state.subscription) {
      this.state.subscription.unsubscribe();
    }
    if (this.selectedRoom.subscription) {
      this.selectedRoom.subscription.unsubscribe();
    }
  }

}
