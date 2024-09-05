import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { FileHandlerService } from '../services/file-handler.service';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  constructor(private fileHandlerService:FileHandlerService){}

  tempDetails:any;

  private roomSubject = new BehaviorSubject<any>([]);
  room$ = this.roomSubject.asObservable();

  private stateSubject = new BehaviorSubject<any>({});
  state$ = this.stateSubject.asObservable();

  getRoom(): Observable<any[]> {
    this.getFromFile()
    return this.roomSubject.asObservable();
  }

  setRoom(room: any[]): void {
    this.roomSubject.next(room);
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

  // constructor(private http: HttpClient) {
  //   // Load initial data from JSON file
  //   this.loadRooms();
  // }

  // Get all rooms from the rooms
  getRooms() {
    return this.rooms;
    
  }

  getFromFile(){
    this.tempDetails = this.fileHandlerService.getData()
    console.log("retrieved data", this.tempDetails)
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
    console.log("New Room Created",newRoom)
    }

    
  }

  // Enter a room by id
  // enterRoom(roomId: string) {
  //   const room = this.rooms.find(room => room.id === roomId);
  //   return of(room).pipe(
  //     catchError(this.handleError<any>('enterRoom'))
  //   );
  // }

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

  // // Load rooms from mock JSON file
  // private loadRooms(): void {
  //   this.getRooms().subscribe(rooms => {
  //     this.rooms = rooms || [];
  //   });
  // }

  // Simulate saving rooms to the mock JSON file
  // private saveRooms(): Observable<any> {
  //   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  //   return this.http.put(this.roomsUrl, this.rooms, { headers }).pipe(
  //     catchError(this.handleError<any>('saveRooms'))
  //   );
  // }

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
