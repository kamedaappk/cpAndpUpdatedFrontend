import { Component, ElementRef, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { RoomService } from '../room.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../../services/alert.service';
import { Store } from '@ngrx/store';
import { selectPageState } from '../../home/home.store.ts/home.selector';
import { selectRoom, selectRoomData } from './room-ui.store/room-ui.selector';
import { LoadRefreshRoomData, sendChatMessage, sendFileMessage, setInfo } from './room-ui.store/room-ui.actions';
import * as QRCode from 'qrcode';

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
    private readonly roomService: RoomService,
    private readonly alertService: AlertService,
    private readonly store: Store,
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
  isDragging: boolean = false; // Flag to track dragging state
  sharedLink: string | null = null;
  qrCodeDataUrl: string | null = null; // To store the generated QR code image URL


  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement> | undefined;
  @Inject(PLATFORM_ID) private readonly platformId: any // Inject the platform ID to check the environment

  ngOnDestroy(): void {
    // if (isPlatformBrowser(this.platformId)) { // Only run this in the browser
    //   // Clean up event listeners to avoid memory leaks
    //   document.removeEventListener('dragenter', this.onDragEnterGlobal.bind(this));
    //   document.removeEventListener('dragover', this.onDragOverGlobal.bind(this));
    //   document.removeEventListener('dragleave', this.onDragLeaveGlobal.bind(this));
    //   document.removeEventListener('drop', this.onDropGlobal.bind(this));

      
    // }
    this.roomService.exitRoom();
  }

  copyMessageText(text: string): void {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(
        () => {
          //console.log('Text copied to clipboard successfully!');
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
        //console.log('Text copied to clipboard successfully!');
        this.alertService.showAlert(`Text copied to clipboard successfully!`, "success");
      } catch (err) {
        console.error('Failed to copy text: ', err);
        this.alertService.showAlert(`Failed to copy text: ${err}`, "error");
      }
      document.body.removeChild(textarea);
    }
  }

// Handle global dragenter event
onDragEnterGlobal(event: DragEvent): void {
  event.preventDefault(); // Prevent default behavior
  this.isDragging = true; // Set dragging state to true
}

// Handle global dragover event
onDragOverGlobal(event: DragEvent): void {
  event.preventDefault(); // Prevent default behavior
}

// Handle global dragleave event
onDragLeaveGlobal(event: DragEvent): void {
  event.preventDefault(); // Prevent default behavior
  this.isDragging = false; // Reset dragging state
}

// Handle global drop event
onDropGlobal(event: DragEvent): void {
  event.preventDefault(); // Prevent default behavior
  this.isDragging = false; // Reset dragging state
  const files = event.dataTransfer?.files;
  if (files?.length) {
    const file = files[0];
    this.handleFileSelection(file); // Handle file selection
  }
}

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
    this.alertService.showAlert(`File size exceeds ${maxSizeInMB} MB. Please select a smaller file.`, "warning");
    this.selectedFile = null; // Reset the file selection if it exceeds the size limit
  } else {
    this.selectedFile = file; // Set the selected file
  }
}

// Trigger file input when the drop zone is clicked
triggerFileInput(): void {
  if (this.fileInput?.nativeElement) {
    this.fileInput.nativeElement.click();
  }
}

uploadFile(): void {
  if (this.selectedFile) {
    const messageData = {
      userId: this.room.userId,
      file: this.selectedFile
    };
    this.store.dispatch(sendFileMessage({ messageData }));
    this.selectedFile = null;
    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
  }
}

removeFile(): void {
  this.selectedFile = null;
  if (this.fileInput?.nativeElement) {
    this.fileInput.nativeElement.value = ''; // Clear the input
  }
}

  downloadFile(filePath: string): void {
    //console.log(filePath)
    const backendUrl = this.roomService.getApi()
    //console.log("backendUrl", backendUrl)
    window.open(`${backendUrl}${filePath}`, '_blank'); // Use full URL with backend port
  }



  ngOnInit(): void {
    this.store.dispatch(setInfo({"info":"Connected to server"}))
    // if (isPlatformBrowser(this.platformId)) { // Only run this in the browser
      this.alertService.showAlert(`Logged into Room`, "success");
      

    //   document.addEventListener('dragenter', this.onDragEnterGlobal.bind(this));
    //   document.addEventListener('dragover', this.onDragOverGlobal.bind(this));
    //   document.addEventListener('dragleave', this.onDragLeaveGlobal.bind(this));
    //   document.addEventListener('drop', this.onDropGlobal.bind(this));
    // }
    // this.roomService.setUpdates();
    this.updateDateTime();
      setInterval(() => {
        this.updateDateTime();
      }, 2000);
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

  onShareClick() {
    this.sharedLink = this.room?.key ? `${window.location.origin}/room/${this.room.key}` : null;
    if (this.sharedLink) {
      // Generate the QR code for the shared link
      QRCode.toDataURL(this.sharedLink)
        .then((url: string | null) => {
          this.qrCodeDataUrl = url; // Store the QR code URL
          //console.log('QR code generated successfully:', url);
        })
        .catch((err: any) => console.error('Error generating QR code', err));
    }
  }

  closeModal(){
    this.sharedLink = null;
    this.qrCodeDataUrl = null;
  }
  
  scrollToInput() {
    const inputElement = document.getElementById('input');
    if (inputElement) {
      inputElement.scrollIntoView({ behavior: 'smooth' });
    }
  }
  

}
