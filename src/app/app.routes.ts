import { Routes } from '@angular/router';
import { RoomComponent } from './room/room.component';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';


export const routes: Routes = [
  // Default route - redirects to home
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  // Home route
  { path: 'home', component: HomeComponent },
  // Room route with dynamic key
  { path: 'room/:key', component: HomeComponent },
  // Admin route
  { path: 'admin8', component: AdminComponent },
  // Wildcard route for handling unknown paths (redirects to home)
  { path: '**', redirectTo: '/home' }
];