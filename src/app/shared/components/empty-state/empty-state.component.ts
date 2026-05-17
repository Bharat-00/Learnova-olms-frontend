import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="empty-state">
      <div class="empty-icon">
        <i class="fas {{ icon }}"></i>
      </div>
      <h3 class="empty-title">{{ title }}</h3>
      <p class="empty-message">{{ message }}</p>
      <button *ngIf="actionLabel" class="btn btn-primary" (click)="action.emit()">
        <i class="fas fa-plus" *ngIf="actionLabel"></i> {{ actionLabel }}
      </button>
    </div>
  `,
  styles: [`
    .empty-state {
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      padding: 56px 24px; text-align: center;
    }
    .empty-icon {
      width: 72px; height: 72px; border-radius: var(--radius-xl);
      background: var(--gray-100);
      display: flex; align-items: center; justify-content: center;
      font-size: 1.75rem; color: var(--gray-400);
      margin-bottom: 20px;
    }
    .empty-title {
      font-size: 1.125rem; font-weight: 600; color: var(--gray-700); margin-bottom: 8px;
    }
    .empty-message {
      font-size: 0.9rem; color: var(--gray-500); max-width: 360px; line-height: 1.6;
      margin-bottom: 24px;
    }
  `]
})
export class EmptyStateComponent {
  @Input() icon = 'fa-inbox';
  @Input() title = 'Nothing here yet';
  @Input() message = 'No data to display at the moment.';
  @Input() actionLabel = '';
  @Output() action = new EventEmitter<void>();
}
