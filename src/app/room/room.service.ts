import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';  

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  private apiUrl = 'http://localhost:3000'; // Your backend URL
  tempDetails:any;

  constructor(private http: HttpClient) { }
  private roomSubject = new BehaviorSubject<any>([]);
  private stateSubject = new BehaviorSubject<any>({});
  private roomDataSubject = new BehaviorSubject<any>({});
  
  room$ = this.roomSubject.asObservable();
  state$ = this.stateSubject.asObservable();
  roomData$ = this.roomDataSubject.asObservable();


  getRoom(): Observable<any[]> {
    // this.getFromFile()
    return this.roomSubject.asObservable();
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
      },
      (error) => {
        console.error("Error fetching room data", error);
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

  private roomDetails: any[] = [
    {
      id: '1',
      userId: 'user1',
      messages: [
        { text: 'Hello from room 1!', timestamp: new Date().toISOString() }
      ]
    },
    {
      id: '2',
      userId: 'user2',
      messages: [
        { text: 'Hi there from room 2!', timestamp: new Date().toISOString() }
      ]
    },
    {
      id: '3',
      userId: 'user3',
      messages: [
        { text: 'Greetings from room 3!', timestamp: new Date().toISOString()}
      ]
    }
  ];// In-memory data store




  saveMessage(userId: string, message: any) {

    // this.http.post(`${this.apiUrl}/saveMessage`, {userId, message}).subscribe();
    const room = this.roomDetails.find(r => r.userId === userId);
    console.log("room", room)
    if (room) {
      room.messages.push(message);
    }
    console.log("room", room)
  }

  getRoomDetails(userId:any) {
    const room = this.roomDetails.find(room => room.userId === userId);
    this.setRoomData(room)
    return room

  }

  // Create a room with a userId and save to JSON file
  // createRoom(userId: string){
    
  //   const room = this.rooms.find(room => room.userId === userId);
  //   // check if room exist then console else create
  //   if(room){
  //     console.log("Room already exist")
  //     return;
  //   }
  //   else{
  //   const newRoom = { id: this.generateId(), userId };
  //   this.rooms.push(newRoom);
  //   this.roomDetails.push({ id: newRoom.id, userId: newRoom.userId, messages: [] });
  //   // this.saveRooms();
  //   console.log("New Room Created",newRoom)
  //   }

    
  // }

  // Get all rooms from the rooms
  getRooms(){
    this.rooms = this.http.get<any[]>(`${this.apiUrl}/rooms`);
    return this.rooms;
  }

  createRoom(userId: string){
    console.log("userId", userId)
    return this.http.post<any>(`${this.apiUrl}/createRoom`, {userId}).subscribe();
  }

  // // Enter a room by userId
    enterRoom(userId: string) {
    // const room = this.rooms.find((room: { userId: string; }) => room.userId === userId);
    const roomer = this.http.post(`${this.apiUrl}/enterRoom`, {userId}).subscribe(
      (data) => {
        this.roomSelected = data
        if(!this.roomSelected){
          console.log("No room exist")
          return null
        }
        console.log("Room Entered", this.roomSelected)
        this.setRoom(this.roomSelected)
        return this.roomSelected
      }
    );
    // if room undefined then no room exist
    
  }

}