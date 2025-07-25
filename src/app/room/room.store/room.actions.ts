// action.ts

import { createAction, props } from "@ngrx/store";
import exp from "constants";
import e from "express";

export const loadCreateRoom = createAction('[Home] Load Create Room', props<{ roomCreateData: any }>());
export const createRoomSuccess = createAction('[Home] Create Room Success', props<{ roomCreateData: any }>());
export const createRoomFailure = createAction('[Home] Create Room Failure', props<{ error: any }>());

export const loadEnterRoom = createAction('[Home] Load Enter Room', props<{ roomEnterData: any }>());
export const enterRoomSuccess = createAction('[Home] Enter Room Success', props<{ roomData: any, pageState:"loggedIn" }>());
export const enterRoomFailure = createAction('[Home] Enter Room Failure', props<{ error: any }>());

export const loadRoomBasics = createAction('[Home] Load Room Basics', props<{ roomEnterData: any }>());
export const roomBasicsSuccess = createAction('[Home] Room Basics Success', props<{ roomData: any }>());
export const roomBasicsFailure = createAction('[Home] Room Basics Failure', props<{ error: any }>());