import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-overlay" *ngIf="visible" (click)="cancel.emit()">
      <div class="modal-box" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <div class="modal-icon" [ngClass]="typeClass">
            <i class="fas {{ icon }}"></i>
          </div>
          <button class="modal-close-btn" (click)="cancel.emit()">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <h3 class="modal-title">{{ title }}</h3>
          <p class="modal-message">{{ message }}</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" (click)="cancel.emit()">{{ cancelLabel }}</button>
          <button class="btn" [ngClass]="confirmBtnClass" (click)="confirm.emit()" [disabled]="loading">
            <span *ngIf="loading" class="spinner-sm"></span>
            {{ confirmLabel }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-icon {
      width: 48px; height: 48px; border-radius: var(--radius-lg);
      display: flex; align-items: center; justify-content: center;
      font-size: 1.2rem;
    }
    .modal-icon.danger  { background: var(--danger-light);  color: var(--danger); }
    .modal-icon.warning { background: var(--warning-light); color: var(--warning); }
    .modal-icon.success { background: var(--success-light); color: var(--success); }
    .modal-icon.info    { background: var(--primary-light); color: var(--primary); }
    .modal-close-btn {
      margin-left: auto; border: none; background: var(--gray-100);
      width: 32px; height: 32px; border-radius: var(--radius);
      cursor: pointer; color: var(--gray-500); display: flex; align-items: center; justify-content: center;
    }
    .modal-title { font-size: 1.1rem; font-weight: 700; margin-bottom: 8px; }
    .modal-message { font-size: 0.9rem; color: var(--gray-500); line-height: 1.6; }
    .spinner-sm {
      display: inline-block; width: 14px; height: 14px;
      border: 2px solid rgba(255,255,255,0.4); border-top-color: #fff;
      border-radius: 50%; animation: spin 0.6s linear infinite;
    }
  `]
})
export class ConfirmationModalComponent {
  @Input() visible = false;
  @Input() title = 'Confirm Action';
  @Input() message = 'Are you sure you want to proceed?';
  @Input() type: 'danger' | 'warning' | 'success' | 'info' = 'danger';
  @Input() confirmLabel = 'Confirm';
  @Input() cancelLabel = 'Cancel';
  @Input() loading = false;

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel  = new EventEmitter<void>();

  get icon(): string {
    const map = { danger: 'fa-trash-alt', warning: 'fa-exclamation-triangle', success: 'fa-check', info: 'fa-info-circle' };
    return map[this.type];
  }
  get typeClass(): string { return this.type; }
  get confirmBtnClass(): string {
    return this.type === 'danger' ? 'btn-danger' : 'btn-primary';
  }
}
