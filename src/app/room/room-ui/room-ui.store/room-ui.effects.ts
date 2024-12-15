// effects.ts

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, concatMap, map, mergeMap, tap } from 'rxjs/operators';
import { LoadRefreshRoomData, LoadRefreshRoomDataFailure, LoadRefreshRoomDataSuccess, sendChatMessage, sendChatMessageFailure, sendChatMessageSuccess, sendFileMessage, sendFileMessageFailure, sendFileMessageSuccess } from './room-ui.actions';
import { RoomService } from '../../room.service';
import { enterRoomSuccess, loadEnterRoom } from '../../room.store/room.actions';

@Injectable()
export class RoomUiEffects {
    constructor(
        private readonly actions$: Actions,
        private readonly roomService: RoomService
    ) { }

    sendChatMessage$ = createEffect(() =>
        this.actions$.pipe(
            ofType(sendChatMessage),
            mergeMap((action) =>
                this.roomService.saveMessage(action.messageData).pipe(
                    concatMap(() => [
                        // Emit each action individually using `concatMap`
                        // loadEnterRoom({ roomEnterData: action.messageData.userId }),
                        sendChatMessageSuccess()
                    ]),
                    catchError((error) => of(sendChatMessageFailure({ error })))
                )
            )
        )
    );

    sendFileMessage$ = createEffect(() =>
        this.actions$.pipe(
            ofType(sendFileMessage),
            mergeMap((action) =>
                this.roomService.uploadFile(action.messageData).pipe(
                    concatMap(() => [
                        // Emit each action individually using `concatMap`
                        // loadEnterRoom({ roomEnterData: action.messageData.userId }),
                        sendFileMessageSuccess()
                    ]),
                    catchError((error) => of(sendFileMessageFailure({ error })))
                )
            )
        )
    );

    LoadRefreshRoomData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LoadRefreshRoomData),
            mergeMap((action) =>
                this.roomService.enterRoom(action.roomId).pipe(
                    map((roomData) => 
                        LoadRefreshRoomDataSuccess({ roomData})),
                    catchError((error) => of(LoadRefreshRoomDataFailure({ error })))
                )
            )
        )
    );

}