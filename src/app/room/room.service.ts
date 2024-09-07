import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';  
import { io, Socket } from 'socket.io-client';


@Injectable({
  providedIn: 'root'
})
export class RoomService {


  
  private apiUrl = 'http://localhost:3000'; // Your backend URL
  // private socket: Socket; // Add this line

  tempDetails:any;

  constructor(private http: HttpClient) { 
    // this.socket = io(this.apiUrl); // Initialize socket connection

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
  
    return this.http.post(`${this.apiUrl}/uploadFile`, formData);
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
    this.http.post(`${this.apiUrl}/getMessages`, { userId }).subscribe(
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
    this.http.post(`${this.apiUrl}/saveMessage`, { userId, message }).subscribe(
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
    this.rooms = this.http.get<any[]>(`${this.apiUrl}/rooms`);
    return this.rooms;
  }

  createRoom(userId: string, duration:any){
    console.log("userId", userId)
    console.log("Expiry", duration)
    return this.http.post<any>(`${this.apiUrl}/createRoom`, {userId, duration}).subscribe(
      (data) => {
        this.roomSelected = data
        console.log("Room Created", this.roomSelected)
        this.setRoom(this.roomSelected)
        this.setState('loggedin')
      }
    );
  }

  // // Enter a room by userId
    enterRoom(userId: string) {
    // const room = this.rooms.find((room: { userId: string; }) => room.userId === userId);
    const roomer = this.http.post(`${this.apiUrl}/enterRoom`, {userId}).subscribe(
      (data) => {
        this.roomSelected = data
        if(!this.roomSelected){
          console.log("No room exist")
          return 
        }
        console.log("Room Entered", this.roomSelected)
        this.setRoom(this.roomSelected)
        this.setState('loggedin')
        return this.roomSelected
      }
    );
    // if room undefined then no room exist
    
  }

  

}