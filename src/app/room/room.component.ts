import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule
import { RoomService } from './room.service';
import { RoomUiComponent } from '../room-ui/room-ui.component';
import { AlertService } from '../services/alert.service';
@Component({
  selector: 'app-room',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RoomUiComponent],
  templateUrl: './room.component.html',
  styleUrl: './room.component.css'
})
export class RoomComponent implements OnInit {
  // @Input() roomName!: string;
  state: any;
  stateSubscription: any;

  selectedRoom: any;
  createForm!: FormGroup; // Use '!' to assert that this will be initialized
  enterForm!: FormGroup;
  roomList: any;


  constructor(
    private fb: FormBuilder,
    private roomService: RoomService,
    private alertService: AlertService,
  ) { }
  ngOnInit() {
    // Subscribe to state changes
    this.stateSubscription = this.roomService.state$.subscribe(updatedState => {
      this.state = updatedState;
    });

    this.roomService.room$.subscribe(updatedRoom => {
      this.selectedRoom = updatedRoom;
    })

    this.createForm = this.fb.group({
      roomName: ['', Validators.required],
      description: [''],
      duration: ['',
        [Validators.required, Validators.min(1), Validators.max(12)]
      ]
    });

    this.enterForm = this.fb.group({
      roomId: ['', Validators.required]
    });

  }

  onCreate() {


    if (this.createForm.valid) {
      // Handle the creation of the room
      this.createForm.value.roomName = this.createForm.value.roomName.toUpperCase();
      console.log('Creating room with data:', this.createForm.value);
      console.log('Room ID', this.createForm.value.roomName)
      // console.log('Room Name', this.createForm.value.duration)

      // set time = current time + duration
      this.createForm.value.duration = new Date().getTime() + this.createForm.value.duration * 3600000;
      console.log('Duration', this.createForm.value.duration)
      // set time = current time
      // this.createForm.value.duration = new Date();
      //  all caps for the roomname

      this.roomService.createRoom(this.createForm.value.roomName, this.createForm.value.duration);
      this.selectedRoom = this.roomService.enterRoom(this.createForm.value.roomName);
      console.log('selected Room at room component on create', this.selectedRoom)
      this.roomService.setState('loggedin')
      this.roomService.setRoom(this.selectedRoom)
      this.roomService.setRoomData(this.selectedRoom.userId)


    }
    else {
      console.log('Form is invalid');
      this.alertService.showAlert("Please fill all the required values", "error")
      return;
    }
  }

  onEnter() {
    if (this.enterForm.valid) {
      // Handle entering the room
      console.log('Checking room with ID:', this.enterForm.value.roomId);
      // make it all caps
      this.enterForm.value.roomId = this.enterForm.value.roomId.toUpperCase();
      this.selectedRoom = this.roomService.enterRoom(this.enterForm.value.roomId);
      // if(this.selectedRoom!=null){
      // console.log('selected Room at room component on enter', this.selectedRoom)
      // this.roomService.setRoomData(this.selectedRoom.userId)

      // }

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
    else {
      console.log('Form is invalid');
      this.alertService.showAlert("Please fill all the required values", "error")
      return;
    }
  }

  onDurationChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.createForm.get('duration')?.setValue(value);
  }

  onInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.toUpperCase();
  }

  getRoomList() {

    this.roomService.getRooms().subscribe({
      next: (data: any) => {
        this.roomList = data;
        console.log("Room List is", this.roomList)
      },
      error: (err: any) => {
        console.error('Error fetching rooms:', err);
      }
    });
  }

  ngOnDestroy() {
    this.stateSubscription?.unsubscribe();
    this.state.subscription?.unsubscribe();
    this.selectedRoom.subscription?.unsubscribe();

  }

}
