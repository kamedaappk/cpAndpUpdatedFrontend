// implement ngrx effects.ts

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { loadServers, loadServersFailure, loadServersSuccess, loadResetAll, loadResetAllSuccess, loadResetAllFailure, loadDeleteAll } from './home.action';
import { HomeService } from '../homeservice.ts/home.service';
import { RoomService } from '../../room/room.service';

@Injectable()
export class HomeEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly homeService: HomeService,
    private readonly roomService: RoomService
  ) {}

  loadServers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadServers),
      mergeMap(() =>
        this.homeService.getServers().pipe(
          map((servers: any) => loadServersSuccess({ servers })),
          catchError((error) => of(loadServersFailure({ error })))
        )
      )
    )
  );

  loadResetAll$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadResetAll),
      mergeMap(() =>
        this.roomService.resetAll().pipe(
          map(() => loadResetAllSuccess()),
          catchError((error) => of(loadResetAllFailure({ error })))
        )
      )
    )
  );

  loadDeleteAll$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadDeleteAll),
      mergeMap(() =>
        this.roomService.deleteAll().pipe(
          map(() => loadResetAllSuccess()),
          catchError((error) => of(loadResetAllFailure({ error })))
        )
      )
    )
  );
}