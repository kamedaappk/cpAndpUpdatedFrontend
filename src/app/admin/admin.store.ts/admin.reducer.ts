// //  implement NgRx reducer.ts

import { createReducer, on } from "@ngrx/store";
import { AdminState, HomeState } from "../../home/home.store.ts/home.state";
import { loadDatas, loadDatasFailure, loadDatasSuccess } from "./admin.action";
import { state } from "@angular/animations";

// import{ createReducer,on} from '@ngrx/store';
// import { loadResetAllFailure, loadResetAllSuccess, loadRoomByKeyFailure, loadRoomByKeySuccess, loadServers, loadServersFailure, loadServersSuccess, setHomeScreenState, setInfoNull, setRoom, setRoomFailure, setRoomSuccess } from './home.action';
// import { HomeState } from './home.state';
// import { createRoomFailure, createRoomSuccess, enterRoomFailure, enterRoomSuccess, loadCreateRoom, loadEnterRoom, roomBasicsFailure, roomBasicsSuccess } from '../../room/room.store/room.actions';
// import { addMessage, LoadRefreshRoomData, LoadRefreshRoomDataFailure, LoadRefreshRoomDataSuccess, sendChatMessage, sendChatMessageFailure, sendChatMessageSuccess, sendFileMessage, sendFileMessageFailure, sendFileMessageSuccess, setInfo } from '../../room/room-ui/room-ui.store/room-ui.actions';


// const initialHomeState: HomeState = {
//     servers: [],
//     loading: false,
//     error: null,
//     pageState: 'home',
//     room: null,
//     roomData: null,
//     info: null
// }

// export const homeReducer = createReducer(
//     initialHomeState,
//     on(loadServers, (state) => ({ ...state, loading: true })),
//     on(loadServersSuccess, (state, { servers }) => ({ ...state, servers, loading: false, error: null })),
//     on(loadServersFailure, (state, { error }) => ({ ...state, error, loading: false })),
//     on(setHomeScreenState, (state, { pageState }) => ({ ...state, pageState })),
//     on(loadCreateRoom, (state) => ({ ...state, loading: true })),
//     on(createRoomSuccess, (state, { roomCreateData }) => ({ ...state, room: roomCreateData, info: "Room Created!!", loading: false, error: null })),
//     on(createRoomFailure, (state, { error }) => ({ ...state, error, loading: false })),
//     on(loadEnterRoom, (state, {roomEnterData}) => ({ ...state, loading: true })),
//     on(enterRoomSuccess, (state, { roomData, pageState }) => ({ ...state, roomData, loading: false, error: null, pageState })),
//     on(enterRoomFailure, (state, { error }) => ({ ...state,  loading: false })),
//     on(sendChatMessage, (state) => ({ ...state, loading: true })),
//     on(sendChatMessageSuccess, (state) => ({ ...state, info:"Message Sent!!", loading: false })),
//     on(sendChatMessageFailure, (state, { error }) => ({ ...state, error, loading: false })),
//     on(sendFileMessage, (state) => ({ ...state, loading: true })),
//     on(sendFileMessageSuccess, (state) => ({ ...state, info:"File Sent!!", loading: false })),
//     on(sendFileMessageFailure, (state, { error }) => ({ ...state, error, loading: false })),
//     on(roomBasicsSuccess, (state, { roomData }) => ({ ...state, room:roomData, loading: false, error: null })),
//     on(roomBasicsFailure, (state, { error }) => ({ ...state, loading: false })),
//     on(setInfoNull, (state) => ({ ...state, info:null })),
//     on(setInfo, (state, {info}) => ({ ...state, info })),
//     on(LoadRefreshRoomData, (state) => ({ ...state, loading: true, error: null })),
//     on(LoadRefreshRoomDataSuccess, (state, { roomData }) => ({ ...state, roomData, loading: false, error: null, info: "Room Data Refreshed!!" })),
//     on(LoadRefreshRoomDataFailure, (state, { error }) => ({ ...state, error, loading: false })),
//     on(addMessage, (state, { message }) => ({ ...state,info: "New Message!!", roomData: { ...state.roomData, messages: [...state.roomData.messages, message] } })),
//     on(loadResetAllSuccess, (state) => initialHomeState),
//     on(loadResetAllFailure, (state) => initialHomeState),
//     on(loadRoomByKeySuccess, (state, { roomData, pageState }) => ({ ...state, roomData: roomData.roomData, room: roomData.room, loading: false, pageState, error: null, info: "Room Data Refreshed!!" })),
//     on(loadRoomByKeyFailure, (state, {error}) => ({ ...state, error, loading: false })),
//     on(setRoom, (state, { roomData }) => ({ ...state, room:roomData.room })),
//     on(setRoomSuccess, (state, { roomMessages, pageState }) => ({ ...state, roomData: roomMessages, loading: false, pageState, error: null, info: "Connected to Room!!" })),
//     on(setRoomFailure, (state, {error}) => ({ ...state, error, loading: false })),

// );


const initialAdminState: AdminState = {
    servers: [],
    loading: false,
    error: null,
    pageState: 'home',
    room: null,
    roomData: null,
    info: null
}

export const homeReducer = createReducer(
    initialAdminState,
    on(loadDatas, (state) => ({ ...state, loading: true })),
    on(loadDatasSuccess, (state, { RoomDatas }) => ({ ...state, RoomDatas, loading: false, error: null })),
    on(loadDatasFailure, (state, { error }) => ({ ...state, error, loading: false })),
    
);