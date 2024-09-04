import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule
import { RoomService } from './room.service';
@Component({
  selector: 'app-room',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './room.component.html',
  styleUrl: './room.component.css'
})
export class RoomComponent implements OnInit {
  // @Input() roomName!: string;
  @Input() state:any;

  createForm!: FormGroup; // Use '!' to assert that this will be initialized
  enterForm!: FormGroup;
  roomList:any;


  constructor(private fb: FormBuilder, private roomService:RoomService) {}
  ngOnInit() {
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
      this.roomService.createRoom(this.createForm.value);
    }
  }

  onEnter() {
    if (this.enterForm.valid) {
      // Handle entering the room
      console.log('Entering room with ID:', this.enterForm.value.roomId);
      this.roomService.enterRoom(this.enterForm.value.roomId);
    }
  }

  getRoomList() {
    this.roomList = this.roomService.getRooms().subscribe((data) => {
      this.roomList = data;
      console.log(this.roomList)
    });
    console.log(this.roomList)
  }

  ngOnDestroy(): void {}
  


}
