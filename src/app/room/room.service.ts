import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private rooms: any[] = []; // In-memory data store

  constructor() {
    // Load initial data
    this.loadRooms();
  }

  // Get all rooms
  getRooms(): Observable<any[]> {
    return of(this.rooms).pipe(
      catchError(this.handleError<any[]>('getRooms', []))
    );
  }

  // Create a room with a userId
  createRoom(userId: string): Observable<any> {
    const newRoom = { id: this.generateId(), userId };
    this.rooms.push(newRoom);
    this.saveRooms(); // Simulate saving to a file or server
    return of(newRoom).pipe(
      catchError(this.handleError<any>('createRoom'))
    );
  }

  // Enter a room by id
  enterRoom(roomId: string): Observable<any> {
    const room = this.rooms.find(room => room.id === roomId);
    return of(room).pipe(
      catchError(this.handleError<any>('enterRoom'))
    );
  }

  // Simulate loading rooms from a file or server
  private loadRooms(): void {
    // Simulate loading data (e.g., from a file or server)
    // For now, we'll use an empty array as initial data
    
    this.rooms = []; // In a real scenario, you would fetch this from a file or server
  }

  // Simulate saving rooms to a file or server
  private saveRooms(): void {
    // In a real scenario, you would send this data to a server
    console.log('Rooms saved:', this.rooms);
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
