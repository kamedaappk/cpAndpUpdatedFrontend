// implement ngrx effects.ts

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, map, mergeMap, of } from 'rxjs';
import { loadServers, loadServersFailure, loadServersSuccess, loadResetAll, loadResetAllSuccess, loadResetAllFailure, loadDeleteAll, LoadRoomByKey, loadRoomByKeySuccess, loadRoomByKeyFailure, setRoom, setRoomSuccess, setRoomFailure } from './home.action';
import { HomeService } from '../homeservice.ts/home.service';
import { RoomService } from '../../room/room.service';
import { loadEnterRoom } from '../../room/room.store/room.actions';

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

  LoadRoomByKey$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LoadRoomByKey),
      mergeMap((action) =>
        this.roomService.getRoomDataByKey(action.key).pipe(
          concatMap((roomData) => [
            loadRoomByKeySuccess({ roomData, pageState:'loggedIn' }),setRoom({ roomData }) ]
          ),
          catchError((error) => of(loadRoomByKeyFailure({ error })))
        )
      )
    )
  );

  SetRoomByKey$ = createEffect(() =>
    this.actions$.pipe(
      ofType(setRoom),
      mergeMap((action) =>
        this.roomService.enterRoom(action.roomData.room.userId).pipe(
          map((roomMessages) => 
            setRoomSuccess({ roomMessages, pageState:'loggedIn' }) 
          ),
          catchError((error) => of(setRoomFailure({ error })))
        )
      )
    )
  );
}