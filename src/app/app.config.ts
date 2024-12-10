import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withFetch  } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { HomeEffects } from './home/home.store.ts/home.effects';
import { homeReducer } from './home/home.store.ts/home.reducer';
import { RoomEffects } from './room/room.store/room.effects';
import { RoomUiEffects } from './room/room-ui/room-ui.store/room-ui.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    provideClientHydration(), 
    provideAnimationsAsync(), 
    provideHttpClient(withFetch()), 
    provideStore({home : homeReducer}), 
    provideEffects(HomeEffects, RoomEffects, RoomUiEffects), 
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() })]
};
