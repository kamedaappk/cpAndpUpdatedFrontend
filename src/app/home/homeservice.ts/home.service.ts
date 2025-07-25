// implement homeservice.ts

import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs";

@Injectable({
    providedIn: 'root'
  })
  export class HomeService {

    constructor(
        private readonly httpService: HttpClient,
    ){}
    getServers() {
        return this.httpService.get('http://localhost:3000/servers').pipe(
            map((response: any) => {
                return response;
            })
        );
    }

  }