import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="spinner-wrap" [class.fullpage]="fullPage">
      <div class="spinner-ring"></div>
      <p class="spinner-text" *ngIf="text">{{ text }}</p>
    </div>
  `,
  styles: [`
    .spinner-wrap {
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      padding: 40px;
    }
    .spinner-wrap.fullpage {
      position: fixed; inset: 0; background: rgba(255,255,255,0.85);
      z-index: 9999;
    }
    .spinner-ring {
      width: 40px; height: 40px;
      border: 3px solid var(--gray-200);
      border-top-color: var(--primary);
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }
    .spinner-text {
      margin-top: 12px; font-size: 0.875rem; color: var(--gray-500);
    }
  `]
})
export class LoadingSpinnerComponent {
  @Input() fullPage = false;
  @Input() text = '';
}
