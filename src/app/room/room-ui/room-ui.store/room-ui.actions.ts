// actions.ts

import { createAction, props } from "@ngrx/store";

export const sendChatMessage = createAction('[Room UI] Send Chat Message', props<{ messageData: any }>());
export const sendChatMessageSuccess = createAction('[Room UI] Send Chat Message Success');
export const sendChatMessageFailure = createAction('[Room UI] Send Chat Message Failure', props<{ error: any }>());

export const sendFileMessage = createAction('[Room UI] Send File Message', props<{ messageData: any }>());
export const sendFileMessageSuccess = createAction('[Room UI] Send File Message Success');
export const sendFileMessageFailure = createAction('[Room UI] Send File Message Failure', props<{ error: any }>());

export const LoadRefreshRoomData = createAction('[Room UI] Load Refresh Room Data', props<{ roomId: string }>());
export const LoadRefreshRoomDataSuccess = createAction('[Room UI] Load Refresh Room Data Success', props<{ roomData: any }>());
export const LoadRefreshRoomDataFailure = createAction('[Room UI] Load Refresh Room Data Failure', props<{ error: any }>());