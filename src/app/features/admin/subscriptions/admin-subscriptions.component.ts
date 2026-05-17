import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { PaymentService } from '../../../core/services/payment.service';
import { Subscription } from '../../../core/models';

@Component({
  selector: 'app-admin-subscriptions',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent, EmptyStateComponent],
  template: `
    <div class="fade-in">
      <div class="page-header"><div><h1 class="page-title">Subscriptions</h1><p class="page-subtitle">Platform subscription management</p></div></div>
      <div class="plan-stats">
        <div class="card plan-stat" *ngFor="let ps of planStats">
          <div class="ps-plan">{{ ps.plan }}</div>
          <div class="ps-count">{{ ps.count }}</div>
          <div class="ps-lbl">subscribers</div>
        </div>
      </div>
      <app-loading-spinner *ngIf="loading" />
      <div class="table-container" *ngIf="!loading && subs.length > 0">
        <table>
          <thead><tr><th>ID</th><th>User</th><th>Plan</th><th>Status</th><th>Start</th><th>End</th><th>Auto Renew</th></tr></thead>
          <tbody>
            <tr *ngFor="let s of subs">
              <td class="text-muted">#{{ s.id }}</td>
              <td>#{{ s.userId }}</td>
              <td><span class="badge badge-primary">{{ s.plan }}</span></td>
              <td><span class="badge" [ngClass]="s.status === 'ACTIVE' ? 'badge-success' : 'badge-gray'">{{ s.status }}</span></td>
              <td class="text-sm text-muted">{{ s.startDate | date:'mediumDate' }}</td>
              <td class="text-sm text-muted">{{ s.endDate | date:'mediumDate' }}</td>
              <td><span class="badge" [ngClass]="s.autoRenew ? 'badge-success' : 'badge-gray'">{{ s.autoRenew ? 'Yes' : 'No' }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
      <app-empty-state *ngIf="!loading && subs.length === 0" icon="fa-layer-group" title="No subscriptions" message="No active subscriptions at this time." />
    </div>
  `,
  styles: [`
    .plan-stats { display: flex; gap: 16px; margin-bottom: 20px; flex-wrap: wrap; }
    .plan-stat { text-align: center; padding: 20px 24px; flex: 1; min-width: 120px; }
    .ps-plan { font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--primary); margin-bottom: 6px; }
    .ps-count { font-family: var(--font-display); font-size: 2rem; font-weight: 800; color: var(--gray-900); }
    .ps-lbl { font-size: 0.78rem; color: var(--gray-500); }
  `]
})
export class AdminSubscriptionsComponent implements OnInit {
  subs: Subscription[] = [];
  loading = true;
  constructor(private paymentService: PaymentService) {}
  ngOnInit() {
    this.paymentService.getAllSubscriptions(0, 50).subscribe({ next: r => { this.subs = r.content || []; this.loading = false; }, error: () => { this.loading = false; } });
  }
  get planStats() {
    const plans = ['FREE', 'BASIC', 'PRO', 'ENTERPRISE'];
    return plans.map(plan => ({ plan, count: this.subs.filter(s => s.plan === plan && s.status === 'ACTIVE').length }));
  }
}
