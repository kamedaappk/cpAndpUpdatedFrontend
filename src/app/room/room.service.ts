import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, BehaviorSubject , Subscription, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';  
import { ConfigurationsService } from '../services/configurations.service';
import { AlertService } from '../services/alert.service';
import { io, Socket } from 'socket.io-client';
import { Store } from '@ngrx/store';
import { addMessage, setInfo } from './room-ui/room-ui.store/room-ui.actions';
import { selectRoom } from './room-ui/room-ui.store/room-ui.selector';
import { isPlatformBrowser } from '@angular/common';
@Injectable({
  providedIn: 'root'
})
export class RoomService {
  
  private backendSubscription: Subscription = new Subscription;
  private apiUrl = 'https://cpandpupdatedbackend.onrender.com'; // Your backend URL
  tempDetails:any;
  room:any;
  // private socket: Socket; // Socket.IO client instance
  socket :any;
  constructor(
    private http: HttpClient, 
    private configurationsService:ConfigurationsService,
    private alertService:AlertService,
    private store:Store,
    @Inject(PLATFORM_ID) private platformId: any
) { 
    this.backendSubscription = this.configurationsService.selectedEndPoint$.subscribe(url => {
      this.apiUrl = url;
    });
    this.store.select(selectRoom).subscribe((room) => this.room = room)

    
    
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
    // //console.log("file Send", formData);
    return this.http.post(`${this.apiUrl}/uploadFile`, formData);
  }

  getRoomBasics(roomEnterData: any) {
    const userId = roomEnterData
    // //console.log("userId", userId)
    return this.http.post(`${this.apiUrl}/enterRoom`, { userId })
  }

  getApi(){
    // this.apiUrl = this.configurationsService.getSelectedEndPoint();
    return this.apiUrl
  }
  
  deleteAll(){
    return this.http.get(`${this.apiUrl}/deleteAllAlone`)
  }

  getRoomDataById(key:any){
    // //console.log("key", key)
    ////console.log("this.apiUrl 1", this.apiUrl)
    // console the reponse befrore returning
    return this.http.post(`${this.apiUrl}/getRoomDataById`, {key});
  }

  getRoomDataByKey(key:any){
    ////console.log("key", key)
    ////console.log("this.apiUrl 1", this.apiUrl)
    // console the reponse befrore returning
    return this.http.post(`${this.apiUrl}/getRoomDataByKey`, {key});
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
      ////console.log("currentTime", currentTime)
    }, 1000); // Update every second
  }

  saveMessage(messageData: any) {
    const userId = messageData.userId;
    const message = messageData.message;
    // Emit the message via socket
    ////console.log("message send", message)
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
    if (isPlatformBrowser(this.platformId)) {
      if (!this.socket) {
        // Initialize socket only in the browser
        this.socket = io(this.apiUrl, { transports: ['websocket'] });
      }
      const userId = roomEnterData;
      this.socket.emit('joinRoom', { userId });
      this.receiveMessages();
    }
    return this.http.post<any>(`${this.apiUrl}/getMessages`, { userId: roomEnterData });
  }

  exitRoom() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null; // Reset the socket instance
      this.store.dispatch(setInfo({"info":"Disconnected from Room"}))
      ////console.log("Disconnected from Room")
    }
  }

  receiveMessages() {
    this.socket.on('message', (data: any) => {
      ////console.log("message received", data)
      this.store.dispatch(addMessage({message:data}))
    });
  }

  setUpdates(){
    if (!this.socket) {
      this.socket = io(this.apiUrl, { transports: ['websocket'] });
    }
    // //console.log("room at update", this.room)
    const userId = this.room.roomId
    this.socket.emit('joinRoom', { userId });
  }

  pingSerer(){
    return this.http.get(`${this.apiUrl}/ping`)
  }
    
  }
