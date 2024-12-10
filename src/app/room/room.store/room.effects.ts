// effects.ts

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, concatMap, map, mergeMap } from 'rxjs/operators';
import { createRoomFailure, createRoomSuccess, enterRoomFailure, enterRoomSuccess, loadCreateRoom, loadEnterRoom, loadRoomBasics, roomBasicsFailure, roomBasicsSuccess } from './room.actions';
import { RoomService } from '../room.service';

@Injectable()
export class RoomEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly roomService: RoomService
  ) {}

  loadCreateRoom$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCreateRoom),
      mergeMap((action) =>
        this.roomService.createRoom(action.roomCreateData).pipe(
          // Use concatMap to dispatch multiple actions sequentially
          concatMap((roomData) => [
            loadEnterRoom({ roomEnterData: action.roomCreateData.userId }),
            createRoomSuccess({ roomCreateData: roomData })
          ]),
          catchError((error) => of(createRoomFailure({ error })))
        )
      )
    )
  );


  loadEnterRoom$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadEnterRoom),
      mergeMap((action) =>
        this.roomService.enterRoom(action.roomEnterData).pipe(
          map((roomData) => enterRoomSuccess({ roomData, pageState:"loggedIn" })),
          catchError((error) => of(createRoomFailure({ error })))
        )
      )
    )
  );

  loadRoomBasics$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadRoomBasics),
      mergeMap((action) =>
        this.roomService.getRoomBasics(action.roomEnterData).pipe(
          map((roomData) => roomBasicsSuccess({ roomData })),
          catchError((error) => of(roomBasicsFailure({ error })))
        )
      )
    )
  );

}