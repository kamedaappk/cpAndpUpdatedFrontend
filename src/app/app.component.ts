import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from "./home/home.component";
import { CommonModule } from '@angular/common';
import { LoadingComponent } from './loading/loading.component';
import { ChangelogComponent } from './changelog/changelog.component';
import { ThemeService } from './services/theme.service';

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
  isDarkTheme = false;

  constructor(private themeService: ThemeService) {
    // Theme is now handled by ThemeService
    this.themeService.isDarkTheme$.subscribe(isDark => {
      this.isDarkTheme = isDark;
    });
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  openChangelog() {
    this.showChangelog = true;
  }

  closeChangelog() {
    this.showChangelog = false;
  }
}
