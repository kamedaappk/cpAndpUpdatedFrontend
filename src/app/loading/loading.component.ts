import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { selectLoading } from '../home/home.store.ts/home.selector';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.css'
})
export class LoadingComponent {
  isLoading = false;

  constructor(private readonly store:Store) {
    this.store.select(selectLoading).subscribe((loading) => {
      this.isLoading = loading;
    })
  }
}
