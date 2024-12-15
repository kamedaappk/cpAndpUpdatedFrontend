// implement homeservice.ts

import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs";
import { ConfigurationsService } from "../../services/configurations.service";

@Injectable({
    providedIn: 'root'
  })
  export class AdminService {
    apiUrl?: string;
    backendSubscription: any;
    constructor(
        private readonly httpService: HttpClient,
        private readonly configurationsService: ConfigurationsService,
    ){
        this.backendSubscription = this.configurationsService.selectedEndPoint$.subscribe(url => {
            this.apiUrl = url;
          });
    }

    getRoomDatas(){
        return this.httpService.get(`${this.apiUrl}/roomDetails`).pipe(
            map((response: any) => {
                return response;
            })
        );
    }

    getServers() {
        return this.httpService.get('http://localhost:3000/servers').pipe(
            map((response: any) => {
                return response;
            })
        );
    }

  }