import { createAction, props } from "@ngrx/store";
import { PageState } from "./home.state";

export const loadServers = createAction('[Home] Load Servers');
export const loadServersSuccess = createAction('[Home] Load Servers Success', (servers: any) => ({ servers }))
export const loadServersFailure = createAction('[Home] Load Servers Failure', (error: any) => ({ error }))

export const setEnterRoomScreen = createAction('[Home] Set Enter Room')
export const setCreateRoomScreen = createAction('[Home] Set Create Room')
export const setHomeScreen = createAction('[Home] Set Home')

export const setHomeScreenState = createAction('[Home] Set Home State', props<{ pageState: PageState }>());

export const loadResetAll = createAction('[Home] Load Reset All');
export const loadResetAllSuccess = createAction('[Home] Load Reset All Success');
export const loadResetAllFailure = createAction('[Home] Load Reset All Failure', (error: any) => ({ error }))

export const loadDeleteAll = createAction('[Home] Load Delete All');
export const loadDeleteAllSuccess = createAction('[Home] Load Delete All Success');
export const loadDeleteAllFailure = createAction('[Home] Load Delete All Failure', (error: any) => ({ error }))

export const setInfoNull = createAction('[Home] Set Info Null')