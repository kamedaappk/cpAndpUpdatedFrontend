import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { RoomService } from '../room.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { text } from 'stream/consumers';
import { Console, timeStamp } from 'console';
import { AlertService } from '../../services/alert.service';
import { Store } from '@ngrx/store';
import { selectPageState } from '../../home/home.store.ts/home.selector';
import { selectRoom, selectRoomData } from './room-ui.store/room-ui.selector';
import { LoadRefreshRoomData, sendChatMessage, sendFileMessage } from './room-ui.store/room-ui.actions';

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
    private store: Store,
  ) {
    this.store.select(selectPageState).subscribe((pageState) => this.state = pageState);
    this.store.select(selectRoomData).subscribe((roomData) => this.roomData = roomData);
    this.store.select(selectRoom).subscribe((room) => this.room = room);
  }
  roomData: any = [];
  username: string = '';
  inputMessage: any = '';
  messages: any;
  dateTime?: string;
  timestamp?: number;
  selectedFile: File | null = null;
  refreshInterval: any;
  countdownTime: number = 15;
  countdown: number = this.countdownTime; // Countdown for 15 seconds
  isRefreshing: boolean = true; // To track if the auto-refresh is on

  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement> | undefined;
  // Method to handle file selection
  // onFileSelected(event: any): void {
  //   const file: File = event.target.files[0];
  //   const maxSizeInMB = 5;
  //   const maxSizeInBytes = maxSizeInMB * 1024 * 1024; // 5 MB in bytes

  //   if (file) {
  //     if (file.size > maxSizeInBytes) {
  //       if (this.fileInput?.nativeElement) {
  //         this.fileInput.nativeElement.value = '';
  //       }
  //       // File size exceeds the limit
  //       this.alertService.showAlert(`File size exceeds ${maxSizeInMB} MB. Please select a smaller file.`, "warning");
  //       // alert(`File size exceeds ${maxSizeInMB} MB. Please select a smaller file.`);
  //     } else {
  //       // File size is within the limit
  //       this.selectedFile = file;
  //       // Proceed with the file processing
  //     }
  //   }
  // }

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

  triggerFileInput(): void {
    // Trigger a click on the hidden file input
    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.click();
    }
  }
  
  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    // Optionally, you can add styles here for highlighting the drop area when dragging
  }
  
  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    
    const files = event.dataTransfer?.files;
    if (files?.length) {
      const file = files[0];
      this.handleFileSelection(file);
    }
  }
  
  // File selection through input or drop
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.handleFileSelection(file);
    }
  }
  
  // Handle file after selection or drop
  handleFileSelection(file: File): void {
    const maxSizeInMB = 5;
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024; // 5 MB in bytes
  
    if (file.size > maxSizeInBytes) {
      if (this.fileInput?.nativeElement) {
        this.fileInput.nativeElement.value = ''; // Reset input
      }
      this.alertService.showAlert(`File size exceeds ${maxSizeInMB} MB. Please select a smaller file.`, "warning");
    } else {
      this.selectedFile = file; // Set the selected file
    }
  }
  
  // Upload the selected file
  uploadFile(): void {
    console.log(this.selectedFile);
    if (this.selectedFile) {
      const messageData = {
        userId: this.room.userId,
        file: this.selectedFile
      };
      this.store.dispatch(sendFileMessage({ messageData }));
      this.selectedFile = null;
      if (this.fileInput?.nativeElement) {
        this.fileInput.nativeElement.value = ''; // Reset the input after upload
      }
    }
  }
  
  // // Method to upload the selected file
  // uploadFile(): void {
  //   console.log(this.selectedFile)
  //   if (this.selectedFile) {
  //     const messageData = {
  //       userId: this.room.userId,
  //       file: this.selectedFile
  //     }
  //     this.store.dispatch(sendFileMessage( {messageData} ))
  //     this.selectedFile=null
  //     if (this.fileInput?.nativeElement) {
  //       this.fileInput.nativeElement.value = '';
  //     }
  //   }
  // }

  downloadFile(filePath: string): void {
    console.log(filePath)
    // const backendUrl = 'https://cpandpupdatedbackend.onrender.com'; // Your backend URL
    const backendUrl = this.roomService.getApi()
    console.log("backendurl", backendUrl)
    window.open(`${backendUrl}${filePath}`, '_blank'); // Use full URL with backend port
  }



  ngOnInit(): void {
    // Subscribe to state changes
    this.alertService.showAlert(`Logged into Room`, "success")
    // this.roomService.updateTime()
    this.updateDateTime();
    setInterval(() => {
      this.updateDateTime();
    }, 2000);

    this.startAutoRefresh()
    
  }

  updateDateTime() {
    this.timestamp = new Date().getTime(); // Get the current timestamp
    this.dateTime = this.convertToIST(this.timestamp); // Call helper function to convert timestamp to IST
  }
  

  saveMessage() {
    if (this.inputMessage === '') return;
    const message = {
      text: this.inputMessage,
      timestamp: this.timestamp,
    };
    const messageData = {
      userId: this.room.userId,
      message,
    };
    this.store.dispatch(sendChatMessage({ messageData }));
    this.inputMessage = '';
  }

  // Function that takes a timestamp and returns formatted date and time in IST
  // Helper function to convert timestamp to IST and format it
  convertToIST(timestamp: number): string {
    const date = new Date(timestamp); // Create a Date object using the timestamp
    
    // Define options for formatting the date and time in IST (Indian Standard Time)
    const options: { 
      timeZone: string; 
      hour12: boolean; 
      year: 'numeric' | '2-digit'; 
      month: 'numeric' | '2-digit' | 'long'; 
      day: 'numeric' | '2-digit'; 
      hour: '2-digit' | 'numeric'; 
      minute: '2-digit' | 'numeric'; 
      second: '2-digit' | 'numeric' 
    } = {
      timeZone: 'Asia/Kolkata',  // Automatically adjusts to IST
      hour12: true,              // 12-hour format
      year: 'numeric', 
      month: 'long', 
      day: '2-digit',
      hour: '2-digit',          // 2-digit hour
      minute: '2-digit',        // 2-digit minute
      second: '2-digit'         // 2-digit second
    };

    // Format the date and time based on the options (in IST)
    return date.toLocaleString('en-IN', options);
  }

  // Refresh room logic
  refreshRoom() {
    console.log("Refreshing room...");
    const roomId = this.room.userId;
    console.log("Room ID:", roomId);
    this.store.dispatch(LoadRefreshRoomData({ roomId }));
  }

  startAutoRefresh() {
    this.countdown = this.countdownTime; // Set countdown to 15 seconds when starting
    this.refreshInterval = setInterval(() => {
      if (this.countdown > 0) {
        this.countdown--; // Decrement countdown every second
      } else {
        this.autoRefresh(); // Trigger auto refresh when countdown reaches 0
        this.countdown = this.countdownTime; // Reset countdown to 15 seconds after refresh
      }
    }, 1000); // Update every second
  }

  autoRefresh() {
    console.log("Auto refresh at", this.isRefreshing);
    if (this.isRefreshing) {
          this.refreshRoom();
      } // else {
    //   clearInterval(this.refreshInterval);
    // }
  }

  // Manual refresh functionality
  manualRefresh() {
    this.refreshRoom(); // Trigger refresh immediately
    this.countdown = this.countdownTime;
  }
}
