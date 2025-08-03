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
    Active: 'active',
    Inactive: 'inactive',
    Error: 'error', // New state for handling errors
    Checking: 'checking' // New state for checking the status
  }
  apiEndpointsList = [
    { title: "Local", url: "http://localhost:3000", active: this.endpointStatus.Checking },
    { title: "On Render", url: "https://cpandpupdatedbackend.onrender.com", active: this.endpointStatus.Checking },
    { title: "On Back4App", url: "https://cpandpbackend02-0xc7ys9t.b4a.run", active: this.endpointStatus.Checking },
    { title: "On Render (2)", url: "https://cpandpupdatedbackend-1.onrender.com", active: this.endpointStatus.Checking },
  ]

  selectedEndPoint = "https://cpandpupdatedbackend.onrender.com"

  private maxUploadSize = 5 * 1024 * 1024; // 5 MB default

  private maxUploadSizeSubject = new BehaviorSubject<number>(this.maxUploadSize);
  maxUploadSize$ = this.maxUploadSizeSubject.asObservable();

  constructor(private http: HttpClient) { }

  private selectedEndPointSubject = new BehaviorSubject<string>("https://cpandpupdatedbackend.onrender.com");
  private apiEndpointsListSubject = new BehaviorSubject<any[]>(this.apiEndpointsList);
  selectedEndPoint$ = this.selectedEndPointSubject.asObservable();
  apiEndpointsList$ = this.apiEndpointsListSubject.asObservable();

  setEndPoint(endPoint: any) {
    // this.selectedEndPoint = endPoint
    this.selectedEndPointSubject.next(endPoint);
  }

  setEndpointsList(endpoints: any[]) {
    this.apiEndpointsListSubject.next(endpoints);
  }

  getSelectedEndPoint() {
    return this.selectedEndPoint
  }

  getMaxUploadSize(): number {
    return this.maxUploadSize;
  }

  setMaxUploadSize(sizeInBytes: number): void {
    // Validate size is between 1MB and 100MB
    const minSize = 1 * 1024 * 1024; // 1 MB
    const maxSize = 100 * 1024 * 1024; // 100 MB

    if (sizeInBytes < minSize) {
      sizeInBytes = minSize;
    } else if (sizeInBytes > maxSize) {
      sizeInBytes = maxSize;
    }

    this.maxUploadSize = sizeInBytes;
    this.maxUploadSizeSubject.next(sizeInBytes);
  }

  getApiEndpointsList() {
    return this.apiEndpointsList;
  }

  getApiEndpointsState() {
    console.log('Checking the state of API endpoints...');

    // Create an array of observables for each endpoint check
    const endpointChecks = this.apiEndpointsList.map(endpoint => {
      console.log(`Pinging endpoint: ${endpoint.url}`);

      // Find the current index of this endpoint
      const index = this.apiEndpointsList.findIndex(e => e.url === endpoint.url);

      // Update status to checking
      this.apiEndpointsList[index].active = this.endpointStatus.Checking;
      this.apiEndpointsListSubject.next([...this.apiEndpointsList]);

      return this.http.get(`${endpoint.url}/ping`, { responseType: 'text' }).pipe(
        map(() => {
          console.log(`Endpoint is active: ${endpoint.url}`);
          // Update the specific endpoint to active
          this.apiEndpointsList[index].active = this.endpointStatus.Active;
          this.apiEndpointsListSubject.next([...this.apiEndpointsList]);
          return { ...this.apiEndpointsList[index] };
        }),
        catchError(err => {
          console.error(`Error pinging endpoint ${endpoint.url}:`, err);
          // Update the specific endpoint to inactive
          this.apiEndpointsList[index].active = this.endpointStatus.Inactive;
          this.apiEndpointsListSubject.next([...this.apiEndpointsList]);
          return of({ ...this.apiEndpointsList[index] });
        })
      );
    });

    // Return a new observable that completes when all requests are done
    // but the UI updates happen immediately through the BehaviorSubject
    return forkJoin(endpointChecks);
  }


}
