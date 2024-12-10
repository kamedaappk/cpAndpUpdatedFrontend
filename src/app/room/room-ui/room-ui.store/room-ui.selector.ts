import { createSelector } from "@ngrx/store";
import { HomeState } from "../../../home/home.store.ts/home.state";
import { selectHomeState } from "../../../home/home.store.ts/home.selector";


export const selectRoomData = createSelector(selectHomeState, (state: HomeState) => state.roomData);
export const selectRoom = createSelector(selectHomeState, (state: HomeState) => state.room);