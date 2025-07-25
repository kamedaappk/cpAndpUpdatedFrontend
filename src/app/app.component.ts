import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from "./home/home.component";
import { CommonModule } from '@angular/common';
import { LoadingComponent } from './loading/loading.component';
import { ChangelogComponent } from './changelog/changelog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true,
  imports: [RouterOutlet, CommonModule, HomeComponent, LoadingComponent, ChangelogComponent],
})
export class AppComponent {
  title = 'cp-and-p-updated';
  showChangelog = false;
  darkTheme = false;

  constructor() {
    // On load, check for saved theme (browser only)
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark') {
        this.darkTheme = true;
        document.body.classList.add('dark-theme');
      }
    }
  }

  toggleTheme() {
    this.darkTheme = !this.darkTheme;
    if (this.darkTheme) {
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

  openChangelog() {
    this.showChangelog = true;
  }

  closeChangelog() {
    this.showChangelog = false;
  }
}
