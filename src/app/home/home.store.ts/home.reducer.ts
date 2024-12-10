//  implement NgRx reducer.ts

import{ createReducer,on} from '@ngrx/store';
import { loadServers, loadServersFailure, loadServersSuccess, setHomeScreenState, setInfoNull } from './home.action';
import { HomeState } from './home.state';
import { createRoomFailure, createRoomSuccess, enterRoomFailure, enterRoomSuccess, loadCreateRoom, loadEnterRoom, roomBasicsFailure, roomBasicsSuccess } from '../../room/room.store/room.actions';
import { LoadRefreshRoomData, LoadRefreshRoomDataFailure, LoadRefreshRoomDataSuccess, sendChatMessage, sendChatMessageFailure, sendChatMessageSuccess, sendFileMessage, sendFileMessageFailure, sendFileMessageSuccess } from '../../room/room-ui/room-ui.store/room-ui.actions';


const initialHomeState: HomeState = {
    servers: [],
    loading: false,
    error: null,
    pageState: 'home',
    room: null,
    roomData: null,
    info: null
}

export const homeReducer = createReducer(
    initialHomeState,
    on(loadServers, (state) => ({ ...state, loading: true })),
    on(loadServersSuccess, (state, { servers }) => ({ ...state, servers, loading: false, error: null })),
    on(loadServersFailure, (state, { error }) => ({ ...state, error, loading: false })),
    on(setHomeScreenState, (state, { pageState }) => ({ ...state, pageState })),
    on(loadCreateRoom, (state) => ({ ...state, loading: true })),
    on(createRoomSuccess, (state, { roomCreateData }) => ({ ...state, room: roomCreateData, info: "Room Created!!", loading: false, error: null })),
    on(createRoomFailure, (state, { error }) => ({ ...state, error, loading: false })),
    on(loadEnterRoom, (state, {roomEnterData}) => ({ ...state, loading: true })),
    on(enterRoomSuccess, (state, { roomData, pageState }) => ({ ...state, roomData, loading: false, error: null, pageState })),
    on(enterRoomFailure, (state, { error }) => ({ ...state,  loading: false })),
    on(sendChatMessage, (state) => ({ ...state, loading: true })),
    on(sendChatMessageSuccess, (state) => ({ ...state, info:"Message Sent!!", loading: false })),
    on(sendChatMessageFailure, (state, { error }) => ({ ...state, error, loading: false })),
    on(sendFileMessage, (state) => ({ ...state, loading: true })),
    on(sendFileMessageSuccess, (state) => ({ ...state, info:"File Sent!!", loading: false })),
    on(sendFileMessageFailure, (state, { error }) => ({ ...state, error, loading: false })),
    on(roomBasicsSuccess, (state, { roomData }) => ({ ...state, room:roomData, loading: false, error: null })),
    on(roomBasicsFailure, (state, { error }) => ({ ...state, loading: false })),
    on(setInfoNull, (state) => ({ ...state, info:null })),
    on(LoadRefreshRoomData, (state) => ({ ...state, loading: true, error: null })),
    on(LoadRefreshRoomDataSuccess, (state, { roomData }) => ({ ...state, roomData, loading: false, error: null, info: "Room Data Refreshed!!" })),
    on(LoadRefreshRoomDataFailure, (state, { error }) => ({ ...state, error, loading: false })),

);