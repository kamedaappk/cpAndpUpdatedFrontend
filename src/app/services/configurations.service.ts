import { Injectable } from '@angular/core';
import { title } from 'process';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationsService {

  apiEndpointsList = [
    {title:"Local",url:"http://localhost:3000", selected:false},
    {title:"Render",url:"https://cpandpupdatedbackend.onrender.com", selected:true}
  ]
  
  selectedEndPoint = "https://cpandpupdatedbackend.onrender.com"
  

  constructor() { }

  setEndPoint(endPoint:any){
    this.selectedEndPoint = endPoint
  }

  getSelectedEndPoint(){
    return this.selectedEndPoint
  }

  getApiEndpointsList(){
    return this.apiEndpointsList
  }



  


}
