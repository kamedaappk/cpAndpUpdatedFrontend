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

  openChangelog() {
    this.showChangelog = true;
  }

  closeChangelog() {
    this.showChangelog = false;
  }
}
