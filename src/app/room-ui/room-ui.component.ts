import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { RoomService } from '../room/room.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { text } from 'stream/consumers';
import { Console, timeStamp } from 'console';
import { AlertService } from '../services/alert.service';
import { ConfigurationsService } from '../services/configurations.service';

@Component({
  selector: 'app-room-ui',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './room-ui.component.html',
  styleUrls: ['./room-ui.component.css']
})
export class RoomUiComponent implements OnInit {
  state: any = null;
  room: any = {
    userId: '',
    id: '',
    duration: 0,
    messages: []
  };
  constructor(
    private roomService: RoomService,
    private alertService: AlertService,
    private configurationsService: ConfigurationsService,
  ) { }

  maxUploadSizeInBytes: number = 5 * 1024 * 1024; // Default to 5MB
  private maxUploadSizeSubscription: any;
  private stateSubscription: any;
  private timeSubscription: any;
  private roomSubscription: any;
  private roomDataSubscription: any;

  roomData: any = [];
  username: string = '';
  inputMessage: any = '';
  messages: any = [];
  time: any = '';
  selectedFile: File | null = null;

  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement> | undefined;
  // Method to handle file selection
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    const maxSizeInMB = this.maxUploadSizeInBytes / (1024 * 1024);
    const maxSizeInBytes = this.maxUploadSizeInBytes;

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
    const backendUrl = this.roomService.getApi()
    console.log("backendurl", backendUrl)
    window.open(`${backendUrl}${filePath}`, '_blank'); // Use full URL with backend port
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


  ngOnInit(): void {
    // Subscribe to state changes
    this.stateSubscription = this.roomService.state$.subscribe(updatedState => {
      this.state = updatedState;
      console.log("state at ng", this.state)
    });

    // Remove immediate alert on init - alerts should be triggered by user actions
    this.roomService.updateTime()
    this.timeSubscription = this.roomService.realTime$.subscribe(updatedTime => {
      // this.time = updatedTime
      const date = new Date(updatedTime);

      // Construct the formatted string
      this.time = this.formatTimestamp(date);
    });
    this.roomSubscription = this.roomService.room$.subscribe(updatedRoom => {
      this.room = updatedRoom;
      this.username = this.room.userId;
      this.room.duration = this.formatTimestamp(this.room.duration);
    });

    this.roomService.roomData$.subscribe(updatedRoomData => {
      this.roomData = updatedRoomData
      console.log("roomData at ng", this.roomData)
      // for all messages format timestamp
      this.roomData.messages.forEach((message: any) => { message.timestamp = this.formatTimestamp(message.timestamp) });

    });

    // Subscribe to max upload size changes
    this.maxUploadSizeSubscription = this.configurationsService.maxUploadSize$.subscribe(size => {
      this.maxUploadSizeInBytes = size;
    });
  }

  ngOnDestroy() {
    if (this.stateSubscription) {
      this.stateSubscription.unsubscribe();
    }
    if (this.roomSubscription) {
      this.roomSubscription.unsubscribe();
    }
    if (this.roomDataSubscription) {
      this.roomDataSubscription.unsubscribe();
    }
    if (this.timeSubscription) {
      this.timeSubscription.unsubscribe();
    }
    // Clean up subscription
    if (this.maxUploadSizeSubscription) {
      this.maxUploadSizeSubscription.unsubscribe();
    }
  }
}
