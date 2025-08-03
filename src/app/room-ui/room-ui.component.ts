import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { RoomService } from '../room/room.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { text } from 'stream/consumers';
import { Console, timeStamp } from 'console';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-room-ui',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './room-ui.component.html',
  styleUrls: ['./room-ui.component.css']
})
export class RoomUiComponent implements OnInit {
  state: any;
  room: any;
  constructor(
    private roomService: RoomService,
    private alertService: AlertService,
  ) { }
  roomData: any = [];
  username: string = '';
  inputMessage: any = '';
  messages: any;
  time: any;
  selectedFile: File | null = null;

  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement> | undefined;
  // Method to handle file selection
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    const maxSizeInMB = 5;
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024; // 5 MB in bytes

    if (file) {
      if (file.size > maxSizeInBytes) {
        if (this.fileInput && this.fileInput.nativeElement) {
          this.fileInput.nativeElement.value = '';
        }
        // File size exceeds the limit
        this.alertService.showAlert(`File size exceeds ${maxSizeInMB} MB. Please select a smaller file.`, "warning");
        // alert(`File size exceeds ${maxSizeInMB} MB. Please select a smaller file.`);
      } else {
        // File size is within the limit
        this.selectedFile = file;
        // Proceed with the file processing
      }
    }
  }

  copyMessageText(text: string): void {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(
        () => {
          console.log('Text copied to clipboard successfully!');
          // Optionally show a success message to the user
        },
        (err) => {
          console.error('Failed to copy text: ', err);
          this.alertService.showAlert(`Failed to copy text: ${err}`, "error");
          // Optionally show an error message to the user
        }
      );
    } else {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        console.log('Text copied to clipboard successfully!');
        this.alertService.showAlert(`Text copied to clipboard successfully!`, "success");
      } catch (err) {
        console.error('Failed to copy text: ', err);
        this.alertService.showAlert(`Failed to copy text: ${err}`, "error");
      }
      document.body.removeChild(textarea);
    }
  }


  // Method to upload the selected file
  uploadFile(): void {
    if (this.selectedFile) {
      // const userId = 'user1'; // Replace with dynamic userId
      this.roomService.uploadFile(this.room.userId, this.selectedFile).subscribe(
        (response) => {
          console.log('File uploaded successfully', response);
          this.alertService.showAlert(`File uploaded successfully`, "success");
          this.roomService.getRoomDataS(this.room.userId)
          // this.selectedFile=null
          // Reset the file input
          if (this.fileInput && this.fileInput.nativeElement) {
            this.fileInput.nativeElement.value = '';
          }
        },
        (error) => {
          console.error('Error uploading file', error);
          this.alertService.showAlert(`Error uploading file: ${error}`, "error");
        }
      );
    }
  }

  downloadFile(filePath: string): void {
    console.log(filePath)
    // const backendUrl = 'https://cpandpupdatedbackend.onrender.com'; // Your backend URL
    const backendUrl = this.roomService.getApi()
    console.log("backendurl", backendUrl)
    window.open(`${backendUrl}${filePath}`, '_blank'); // Use full URL with backend port
  }



  ngOnInit(): void {
    // Subscribe to state changes
    this.roomService.state$.subscribe(updatedState => {
      this.state = updatedState;
      console.log("state at ng", this.state)
    });

    this.alertService.showAlert(`Logged into Room`, "success")
    this.roomService.updateTime()
    // Join the room
    // this.roomService.joinRoom(this.room.userId);

    // Listen for incoming messages
    // this.roomService.onMessage().subscribe((message) => {
    //   this.messages.push(message);
    // });
    this.roomService.realTime$.subscribe(updatedTime => {
      // this.time = updatedTime
      const date = new Date(updatedTime);

      // Construct the formatted string
      this.time = this.formatTimestamp(date);
    }
    )
    this.roomService.room$.subscribe(updatedRoom => {
      this.room = updatedRoom;
      this.username = this.room.userId;
      // this.room.duration = this.convertTime(this.room.duration)
      this.room.duration = this.formatTimestamp(this.room.duration);
      // console.log("room at ng", this.room)
      // console.log("username at ng", this.username)
      // this.messages=this.roomService.getRoomDataS(this.username)
      // console.log("room expiry", this.roomData.duration)
      // console.log("messages at ng", this.messages)
      // this.roomService.getRoomData(this.room.userId)
    });

    this.roomService.roomData$.subscribe(updatedRoomData => {
      this.roomData = updatedRoomData
      console.log("roomData at ng", this.roomData)
      // for all messages format timestamp
      this.roomData.messages.forEach((message: any) => { message.timestamp = this.formatTimestamp(message.timestamp) });
      // this.roomData.messages.timestamp=this.formatTimestamp(this.roomData.messages.timestamp)
      // this.messages=this.roomData.messages
      // console.log("roomData at ng", this.roomData)
      // console.log("messages at ng", this.messages)

    });



    // this.roomData=this.roomService.getRoomDetails(this.room.userId)
    // console.log("roomData", this.roomData)

    // this.roomData=this.roomService.getRoomDetails(this.room.userId)
    // this.roomService.getRoomDetails(this.room.userId)

  }

  // Function to convert a numeric timestamp to yy-mm-dd-hh-mm-ss format
  formatTimestamp(timestamp: any): string {
    // Create a new Date object from the timestamp
    const date = new Date(timestamp);

    // Extract each component of the date
    const year = date.getFullYear().toString().slice(-2); // Last 2 digits of the year
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    // Construct the formatted string
    return ` ${day}/${month}/${year} @ ${hours}:${minutes}:${seconds}`;
  }
  saveMessage() {
    console.log("message", this.inputMessage)
    // if message = '' avoid
    if (this.inputMessage === '') return;
    this.inputMessage = {
      text: this.inputMessage,
      timestamp: new Date().getTime()
    }
    this.roomService.saveMessage(this.room.userId, this.inputMessage)
    this.inputMessage = ''
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
    if (this.time.subscription) {
      this.time.subscription.unsubscribe();
    }
  }
}
