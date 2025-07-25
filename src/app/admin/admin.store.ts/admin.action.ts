import { createAction, props } from "@ngrx/store";
import { PageState } from "../../home/home.store.ts/home.state";

// export const loadServers = createAction('[Home] Load Servers');
// export const loadServersSuccess = createAction('[Home] Load Servers Success', (servers: any) => ({ servers }))
// export const loadServersFailure = createAction('[Home] Load Servers Failure', props<{error: string}>())

// export const setEnterRoomScreen = createAction('[Home] Set Enter Room')
// export const setCreateRoomScreen = createAction('[Home] Set Create Room')
// export const setHomeScreen = createAction('[Home] Set Home')

// export const setHomeScreenState = createAction('[Home] Set Home State', props<{ pageState: PageState }>());

// export const loadResetAll = createAction('[Home] Load Reset All');
// export const loadResetAllSuccess = createAction('[Home] Load Reset All Success');
// export const loadResetAllFailure = createAction('[Home] Load Reset All Failure', props<{error: string}>());

// export const loadDeleteAll = createAction('[Home] Load Delete All');
// export const loadDeleteAllSuccess = createAction('[Home] Load Delete All Success');
// export const loadDeleteAllFailure = createAction('[Home] Load Delete All Failure', props<{error: string}>());

// export const setInfoNull = createAction('[Home] Set Info Null')

// export const LoadRoomByKey = createAction('[Home] Load Room By Key', props<{key: string}>());
// export const loadRoomByKeySuccess = createAction('[Home] Load Room By Key Success', props<{roomData: any, pageState: PageState}>());
// export const loadRoomByKeyFailure = createAction('[Home] Load Room By Key Failure', props<{error: string}>());

// export const setRoom = createAction('[Home] Set Room', props<{roomData: any}>());
// export const setRoomSuccess = createAction('[Home] Set Room Success', props<{roomMessages: any, pageState: PageState}>());
// export const setRoomFailure = createAction('[Home] Set Room Failure', props<{error: string}>());

export const loadDatas = createAction('[Admin] Load Datas');
export const loadDatasSuccess = createAction('[Admin] Load Datas Success', props<{RoomDatas: any}>());
export const loadDatasFailure = createAction('[Admin] Load Datas Failure', props<{error: string}>());
