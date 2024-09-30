import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';  
import { io, Socket } from 'socket.io-client';
import { LoadingService } from '../services/loading.service';
import { catchError, finalize } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { AlertService } from '../services/alert.service';

import { ConfigurationsService } from '../services/configurations.service';
@Injectable({
  providedIn: 'root'
})
export class RoomService {


  private backendSubscription: Subscription = new Subscription;
  
  private apiUrl = 'https://cpandpupdatedbackend.onrender.com'; // Your backend URL
  // private socket: Socket; // Add this line

  tempDetails:any;

  constructor(
    private http: HttpClient, 
    private loadingService: LoadingService,
    private configurationsService:ConfigurationsService,
    private alertService:AlertService,
) { 
    // this.socket = io(this.apiUrl); // Initialize socket connection
    // this.apiUrl = this.configurationsService.getSelectedEndPoint();
    this.backendSubscription = this.configurationsService.selectedEndPoint$.subscribe(url => {
      this.apiUrl = url;
    });
    

  }
  private roomSubject = new BehaviorSubject<any>([]);
  private stateSubject = new BehaviorSubject<any>({});
  private roomDataSubject = new BehaviorSubject<any>({});
  private realTimeSubject = new BehaviorSubject<any>([]);
  
  room$ = this.roomSubject.asObservable();
  state$ = this.stateSubject.asObservable();
  roomData$ = this.roomDataSubject.asObservable();
  realTime$ = this.realTimeSubject.asObservable();


  uploadFile(userId: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId);
    this.loadingService.show(); // Show loading screen
    return this.http.post(`${this.apiUrl}/uploadFile`, formData).pipe(
      finalize(() => this.loadingService.hide()) // Hide loading screen after request completes
    );
  }
  
  getApi(){
    // this.apiUrl = this.configurationsService.getSelectedEndPoint();
    return this.apiUrl
  }
  
  deleteAll(){
    this.loadingService.show(); // Show loading screen
    this.http.get(`${this.apiUrl}/deleteAllAlone`).pipe(
      finalize(() => this.loadingService.hide()) // Hide loading screen after request completes
    ).subscribe()
  }

  resetAll(){
    this.loadingService.show(); // Show loading screen
    this.http.get(`${this.apiUrl}/resetAll`).pipe(
      finalize(() => this.loadingService.hide()) // Hide loading screen after request completes
    ).subscribe()
  }

  // // socketss
  // // Method to join a room
  // joinRoom(userId: string): void {
  //   this.socket.emit('joinRoom', { userId });
  //   console.log(`${userId} joined the room via socket`);
  // }

  // Method to send a new message
  // sendMessage(userId: string, message: any): void {
  //   this.socket.emit('newMessage', { userId, message });
  // }

  // // Method to receive messages
  // onMessage(): Observable<any> {
  //   return new Observable(observer => {
  //     this.socket.on('message', (message: any) => {
  //       observer.next(message);
  //     });
  //   });

  // }

  // Modify saveMessage to use sockets
  // saveMessages(userId: string, message: any): void {
  //   // Optionally, keep HTTP call to save to backend
  //   // this.http.post(`${this.apiUrl}/saveMessage`, { userId, message }).subscribe();

  //   // Use socket to send the message
  //   this.sendMessage(userId, message);
  // }

  // getRoom(): Observable<any[]> {
  //   // this.getFromFile()
  //   return this.roomSubject.asObservable();
  // }

  getRealtime(){
    // current date and time
    return this.realTimeSubject.asObservable();
  }

  setRealtime(data:any){
    this.realTimeSubject.next(data)
  }
  

  setRoom(room: any[]): void {
    console.log("room at setRoom", room)
    this.roomSubject.next(room);
  }

  setRoomData(room:any){
    console.log("room at setRoomData", room)
    this.roomDataSubject.next(room)
  }
  

  getRoomData(): Observable<any> {
    return this.roomDataSubject.asObservable();
  }
  

  getRoomDataS(userId: any) {
    console.log("user id for message request", userId);
    if (userId === undefined) {
      return;
    }
    this.loadingService.show(); // Show loading screen
    this.http.post(`${this.apiUrl}/getMessages`, { userId }).pipe(
      finalize(() => this.loadingService.hide()) // Hide loading screen after request completes
    ).subscribe(
      (data) => {
        console.log("data at getRoomDataS", data);
        this.setRoomData(data);
      }
    );
  }

  getState(): any {
    return this.stateSubject.getValue();
  }

  // Method to update the state
  setState(newState: any): void {
    console.log("newState", newState)
    this.stateSubject.next(newState);
  }

  roomSelected:any;
  rooms: any; // In-memory data store

// update the current time automatically
  updateTime() {
    setInterval(() => {
      const currentTime = new Date().getTime();
      this.setRealtime(currentTime);
      console.log("currentTime", currentTime)
    }, 1000); // Update every second
  }



  saveMessage(userId: string, message: any) {
    this.loadingService.show(); // Show loading screen
    this.http.post(`${this.apiUrl}/saveMessage`, { userId, message }).pipe(
      finalize(() => this.loadingService.hide()) // Hide loading screen after request completes
    ).subscribe(
      (data) => {
        this.setRoomData(data)
        // this.sendMessage(userId, message);
  
        console.log("Message saved successfully");
      }
      
    );
  }

  // getRoomDetails(userId:any) {
  //   const room = this.roomDetails.find(room => room.userId === userId);
  //   this.setRoomData(room)
  //   return room

  // }

  getRooms(){
    this.loadingService.show(); // Show loading screen
    console.log("getRooms via", this.apiUrl)
    this.rooms = this.http.get<any[]>(`${this.apiUrl}/rooms`).pipe(
      finalize(() => this.loadingService.hide()) // Hide loading screen after request completes
    );
    return this.rooms;
  }

  createRoom(userId: string, duration: any) {
    console.log("userId", userId);
    console.log("Expiry", duration);
    this.loadingService.show();
    
    return this.http.post<any>(`${this.apiUrl}/createRoom`, { userId, duration }).pipe(
      finalize(() => this.loadingService.hide()), // Hide loading screen after request completes
      catchError((error) => {
        console.error('Error creating room:', error); // Log the error
        // Notify the user of the error
        // alert('Failed to create the room. Please try again.'); // Example notification
        return of(null); // Return an observable with a null value to continue the stream
      })
    ).subscribe(
      (data) => {
        if (!data) {
          console.log("Room creation failed.");
          this.alertService.showAlert("Room creation failed. Please try again!!!", "error");
          return;
        }
        this.roomSelected = data;
        console.log("Room Created", this.roomSelected);
        this.alertService.showAlert("Room Created Successfully", "success")
        this.setRoom(this.roomSelected);
        this.setState('loggedin');
      }
    );
}

  // // Enter a room by userId
  enterRoom(userId: string) {
    this.loadingService.show();
    const roomer = this.http.post(`${this.apiUrl}/enterRoom`, { userId }).pipe(
      finalize(() => this.loadingService.hide()), // Hide loading screen after request completes
      catchError((error) => {
        console.error('Error entering room:', error); // Log the error
        // You can also show a user-friendly message or notification here
        // alert('Failed to enter the room. Please try again.'); // Example notification
        return of(null); // Return an observable with a null value to continue the stream
      })
    ).subscribe(
      (data) => {
        this.roomSelected = data;
        if (!this.roomSelected) {
          console.log("No room exists");
          this.alertService.showAlert("No room exists Please Create one!!!", "warning");
          return;
        }
        console.log("Room Entered", this.roomSelected);
        this.setRoom(this.roomSelected);
        // this.updateTime();
        this.getRoomDataS(this.roomSelected.userId);
        this.setState('loggedin');
      }
    );
}
    // if room undefined then no room exist
    
  }
