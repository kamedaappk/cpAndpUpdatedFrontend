import { Injectable } from '@angular/core';
import { title } from 'process';
import { BehaviorSubject, forkJoin, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class ConfigurationsService {

  endpointStatus = {
    Active :'active',
    Inactive : 'inactive',
    Error : 'error', // New state for handling errors
    Checking : 'checking' // New state for checking the status
  }
  apiEndpointsList = [
    {title:"Local",url:"http://localhost:3000", active: this.endpointStatus.Checking},
    {title:"On Render",url:"https://cpandpupdatedbackend.onrender.com", active: this.endpointStatus.Checking},
    {title:"On Back4App",url:"https://cpandpbackend01-ad9mkl9f.b4a.run", active: this.endpointStatus.Checking},
    {title:"On Back4App (2)",url:"https://cpandpbackend02-0xc7ys9t.b4a.run", active: this.endpointStatus.Checking},
  ]
  
  selectedEndPoint = "https://cpandpupdatedbackend.onrender.com"
  

  constructor(private http: HttpClient) { }

  private selectedEndPointSubject = new BehaviorSubject<string>("https://cpandpupdatedbackend.onrender.com");
  private apiEndpointsListSubject = new BehaviorSubject<any[]>(this.apiEndpointsList);
  selectedEndPoint$ = this.selectedEndPointSubject.asObservable();
  apiEndpointsList$ = this.apiEndpointsListSubject.asObservable();

  setEndPoint(endPoint:any){
    // this.selectedEndPoint = endPoint
    this.selectedEndPointSubject.next(endPoint);
  }

  setEndpointsList(endpoints:any[]){
    this.apiEndpointsListSubject.next(endpoints);
  }

  getSelectedEndPoint(){
    return this.selectedEndPoint
  }

  getApiEndpointsList(){
    return this.apiEndpointsList;
  }

  getApiEndpointsState() {
    console.log('Checking the state of API endpoints...');
  
    const pingRequests = this.apiEndpointsList.map(endpoint => {
      console.log(`Pinging endpoint: ${endpoint.url}`);
      return this.http.get(`${endpoint.url}/ping`, { responseType: 'text' }).pipe(
        map(() => {
          console.log(`Endpoint is active: ${endpoint.url}`);
          return { ...endpoint, active: this.endpointStatus.Active };
        }),
        catchError(err => {
          console.error(`Error pinging endpoint ${endpoint.url}:`, err);
          return of({ ...endpoint, active: this.endpointStatus.Inactive }); // If it fails, set active to false
        })
      );
    });
  
    return forkJoin(pingRequests).pipe(
      map(endpointsWithState => {
        console.log('API endpoints state updated:', endpointsWithState);
        this.apiEndpointsList = endpointsWithState; // Update the state of the endpoints list
        return this.apiEndpointsList;
      })
    );
  
  }




  


}
