import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  tempDetails:any;

  private roomDetailsAllSubject = new BehaviorSubject<any>([]);
  private roomSubject = new BehaviorSubject<any>([]);
  private stateSubject = new BehaviorSubject<any>({});
  
  room$ = this.roomSubject.asObservable();
  state$ = this.stateSubject.asObservable();

  getRoom(): Observable<any[]> {
    // this.getFromFile()
    return this.roomSubject.asObservable();
  }

  setRoom(room: any[]): void {
    this.roomSubject.next(room);
  }

  getRoomDetailsAll(): Observable<any[]> {
    return this.roomDetailsAllSubject.asObservable();
  }

  setRoomDetailsAll(roomDetails: any[]): void {
    this.roomDetailsAllSubject.next(roomDetails);
  }

  getState(): any {
    return this.stateSubject.getValue();
  }

  // Method to update the state
  setState(newState: any): void {
    this.stateSubject.next(newState);
  }

  roomSelected='';
  private roomsUrl = 'assets/databasemock.json'; // URL to mock JSON file
  private rooms: any[] = [
    { id: '1', userId: 'user1' },
    { id: '2', userId: 'user2' },
    { id: '3', userId: 'user3' }
  ]; // In-memory data store

  private roomDetails: any[] = [
    { id: '1', userId: 'user1' },
    { id: '2', userId: 'user2' },
    { id: '3', userId: 'user3' }
  ]; // In-memory data store

  // Get all rooms from the rooms
  getRooms() {
    return this.rooms;
    
  }


  getRoomDetails(userId:any) {
    const room = this.roomDetails.find(room => room.userId === userId);
    return room

  }

  // Create a room with a userId and save to JSON file
  createRoom(userId: string){
    
    const room = this.rooms.find(room => room.userId === userId);
    // check if room exist then console else create
    if(room){
      console.log("Room already exist")
      return;
    }
    else{
    const newRoom = { id: this.generateId(), userId };
    this.rooms.push(newRoom);
    // this.saveRooms();
    console.log("New Room Created",newRoom)
    }

    
  }


  // // Enter a room by userId
    enterRoom(userId: string) {
    const room = this.rooms.find(room => room.userId === userId);
    // if room undefined then no room exist
    if(!room){
      console.log("No room exist")
      return null
    }
    console.log("Room Entered", room)
    this.roomSelected = room
    return room
  }



  // Generate a unique id for new rooms
  private generateId(): string {
    return (Math.random() * 1000000).toFixed(0);
  }

  // Handle errors
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
