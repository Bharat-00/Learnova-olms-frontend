import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stats-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stats-card" [style.--accent]="color">
      <div class="stats-icon">
        <i class="fas {{ icon }}"></i>
      </div>
      <div class="stats-body">
        <div class="stats-value">{{ value }}</div>
        <div class="stats-label">{{ label }}</div>
        <div class="stats-change" *ngIf="change" [class.positive]="changePositive" [class.negative]="!changePositive">
          <i class="fas" [class.fa-arrow-up]="changePositive" [class.fa-arrow-down]="!changePositive"></i>
          {{ change }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .stats-card {
      background: var(--white);
      border: 1px solid var(--gray-200);
      border-radius: var(--radius-lg);
      padding: 22px;
      display: flex; align-items: flex-start; gap: 16px;
      box-shadow: var(--shadow-sm);
      transition: var(--transition);
    }
    .stats-card:hover { box-shadow: var(--shadow); transform: translateY(-2px); }
    .stats-icon {
      width: 48px; height: 48px; border-radius: 12px; flex-shrink: 0;
      background: color-mix(in srgb, var(--accent, var(--primary)) 12%, transparent);
      display: flex; align-items: center; justify-content: center;
      font-size: 1.2rem;
      color: var(--accent, var(--primary));
    }
    .stats-body { flex: 1; min-width: 0; }
    .stats-value {
      font-family: var(--font-display); font-size: 1.75rem; font-weight: 700;
      color: var(--gray-900); line-height: 1;
    }
    .stats-label {
      font-size: 0.85rem; color: var(--gray-500); margin-top: 4px;
    }
    .stats-change {
      font-size: 0.78rem; font-weight: 600; margin-top: 6px;
      display: flex; align-items: center; gap: 3px;
    }
    .stats-change.positive { color: var(--success); }
    .stats-change.negative { color: var(--danger); }
  `]
})
export class StatsCardComponent {
  @Input() label = '';
  @Input() value: string | number = 0;
  @Input() icon = 'fa-chart-bar';
  @Input() color = 'var(--primary)';
  @Input() change = '';
  @Input() changePositive = true;
}
