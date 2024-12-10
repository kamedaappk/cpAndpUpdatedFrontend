import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject , Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';  
import { ConfigurationsService } from '../services/configurations.service';
import { AlertService } from '../services/alert.service';
@Injectable({
  providedIn: 'root'
})
export class RoomService {
  
  private backendSubscription: Subscription = new Subscription;
  private apiUrl = 'https://cpandpupdatedbackend.onrender.com'; // Your backend URL
  tempDetails:any;
  constructor(
    private http: HttpClient, 
    private configurationsService:ConfigurationsService,
    private alertService:AlertService,
) { 
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

  uploadFile(messageData : any): Observable<any> {
    const formData = new FormData();
    const file = messageData.file;
    const userId = messageData.userId;
    formData.append('file', file);
    formData.append('userId', userId);
    return this.http.post(`${this.apiUrl}/uploadFile`, formData);
  }

  getRoomBasics(roomEnterData: any) {
    const userId = roomEnterData
    console.log("userId", userId)
    return this.http.post(`${this.apiUrl}/enterRoom`, { userId })
  }

  getApi(){
    // this.apiUrl = this.configurationsService.getSelectedEndPoint();
    return this.apiUrl
  }
  
  deleteAll(){
    return this.http.get(`${this.apiUrl}/deleteAllAlone`)
  }

  resetAll(){
    // this.loadingService.show(); // Show loading screen
    return this.http.get(`${this.apiUrl}/resetAll`)
  }

  getRealtime(){
    // current date and time
    return this.realTimeSubject.asObservable();
  }

  setRealtime(data:any){
    this.realTimeSubject.next(data)
  }

// update the current time automatically
  updateTime() {
    setInterval(() => {
      const currentTime = new Date().getTime();
      this.setRealtime(currentTime);
      console.log("currentTime", currentTime)
    }, 1000); // Update every second
  }

  saveMessage(messageData:any) {
    const userId = messageData.userId
    const message = messageData.message
    return this.http.post(`${this.apiUrl}/saveMessage`, { userId, message });
  }

  getRooms(){
    // this.loadingService.show(); // Show loading screen
    return this.http.get<any[]>(`${this.apiUrl}/rooms`)
  }

  createRoom(roomCreateData : any) {
    const userId = roomCreateData.userId
    const duration = roomCreateData.duration
    return this.http.post<any>(`${this.apiUrl}/createRoom`, { userId, duration })

}

  // // Enter a room by userId
  enterRoom(roomEnterData: string) {
    console.log("roomEnterData", roomEnterData)
    const userId = roomEnterData
    return this.http.post<any>(`${this.apiUrl}/getMessages`, { userId })
  }
    
  }
