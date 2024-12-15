import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms'; // Import ReactiveFormsModule
import { RoomService } from './room.service';
import { RoomUiComponent } from './room-ui/room-ui.component';
import { AlertService } from '../services/alert.service';
import { Store } from '@ngrx/store';
import { selectPageState } from '../home/home.store.ts/home.selector';
import { loadCreateRoom, loadEnterRoom, loadRoomBasics } from './room.store/room.actions';
import { selectRoom } from './room-ui/room-ui.store/room-ui.selector';
@Component({
  selector: 'app-room',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RoomUiComponent],
  templateUrl: './room.component.html',
  styleUrl: './room.component.css'
})
export class RoomComponent implements OnInit {
  // @Input() roomName!: string;
  state?:any;
  stateSubscription:any;

  selectedRoom?:any;
  createForm!: FormGroup; // Use '!' to assert that this will be initialized
  enterForm!: FormGroup;
  roomList?:any;
  room?:any;


  constructor(
    private readonly fb: FormBuilder, 
    private readonly roomService:RoomService,
    private readonly alertService: AlertService,
    private readonly store: Store,
  ) {
    this.store.select(selectPageState).subscribe((pageState) => {this.state = pageState;});
    this.store.select(selectRoom).subscribe((room) => {this.room = room;});
  }
  ngOnInit() {
    // Subscribe to state changes
    this.roomService.room$.subscribe(updatedRoom => {this.selectedRoom = updatedRoom;})
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
      // Get the current UTC timestamp
      const utcTimestamp = new Date().getTime();
      // Convert the UTC timestamp to IST by adding 5.5 hours (in milliseconds)
      const istOffsetInMillis = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds
      const istTimestamp = utcTimestamp + istOffsetInMillis;
      // Now calculate the new timestamp with the duration in hours, using IST timestamp
      this.createForm.value.duration = istTimestamp + this.createForm.value.duration * 3600000;
      //console.log('Creating room with name:', this.createForm.value);
      const roomCreateData = {
        userId: this.createForm.value.roomName,
        description: this.createForm.value.description,
        duration: this.createForm.value.duration
      }
      this.store.dispatch(loadCreateRoom({ roomCreateData }))
      // this.roomService.createRoom(this.createForm.value.roomName, this.createForm.value.duration);
    }
    else
    {
      //console.log('Form is invalid');
      this.alertService.showAlert("Please fill all the required values", "error")
      return;
    }
  }

  onEnter() {
    if (this.enterForm.valid) {
      // Handle entering the room
      //console.log('Checking room with ID:', this.enterForm.value.roomId);
      // make it all caps
      this.enterForm.value.roomId = this.enterForm.value.roomId.toUpperCase();
      this.store.dispatch(loadEnterRoom({ roomEnterData: this.enterForm.value.roomId }))
      this.store.dispatch(loadRoomBasics({ roomEnterData: this.enterForm.value.roomId }))
    }
    else{
      //console.log('Form is invalid');
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
        //console.log("Room List is", this.roomList)
      },
      error: (err: any) => {
        console.error('Error fetching rooms:', err);      }
    });
  }

  ngOnDestroy() {
    this.stateSubscription?.unsubscribe();
    this. state.subscription?.unsubscribe();
    this.selectedRoom.subscription?.unsubscribe();

  }

}
