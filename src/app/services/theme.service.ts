import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkTheme = new BehaviorSubject<boolean>(false);
  public isDarkTheme$ = this.darkTheme.asObservable();

  constructor() {
    // On load, check for saved theme (browser only)
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark') {
        this.darkTheme.next(true);
      }
    }
  }

  toggleTheme(): void {
    const isDark = !this.darkTheme.value;
    this.darkTheme.next(isDark);
    
    if (isDark) {
      document.body.classList.add('dark-theme');
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.setItem('theme', 'dark');
      }
    } else {
      document.body.classList.remove('dark-theme');
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.setItem('theme', 'light');
      }
    }
  }

  setDarkTheme(isDark: boolean): void {
    this.darkTheme.next(isDark);
    
    if (isDark) {
      document.body.classList.add('dark-theme');
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.setItem('theme', 'dark');
      }
    } else {
      document.body.classList.remove('dark-theme');
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.setItem('theme', 'light');
      }
    }
  }

  isDarkTheme(): boolean {
    return this.darkTheme.value;
  }
}