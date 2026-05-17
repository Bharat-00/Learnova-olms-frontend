// ─── Admin Payments ───────────────────────────────────────────────────────────
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { PaymentService } from '../../../core/services/payment.service';
import { Payment } from '../../../core/models';

@Component({
  selector: 'app-admin-payments',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent, EmptyStateComponent],
  template: `
    <div class="fade-in">
      <div class="page-header"><div><h1 class="page-title">Payment Records</h1><p class="page-subtitle">All platform transactions</p></div></div>
      <div class="stats-mini-row">
        <div class="card sm-stat"><i class="fas fa-dollar-sign"></i><div><div class="sm-val">{{ totalRevenue | number:'1.2-2' }}</div><div class="sm-lbl">Total Revenue</div></div></div>
        <div class="card sm-stat"><i class="fas fa-check-circle" style="color:var(--success)"></i><div><div class="sm-val">{{ successCount }}</div><div class="sm-lbl">Successful</div></div></div>
        <div class="card sm-stat"><i class="fas fa-times-circle" style="color:var(--danger)"></i><div><div class="sm-val">{{ failedCount }}</div><div class="sm-lbl">Failed</div></div></div>
      </div>
      <app-loading-spinner *ngIf="loading" />
      <div class="table-container" *ngIf="!loading && payments.length > 0">
        <table>
          <thead><tr><th>ID</th><th>User</th><th>Course</th><th>Amount</th><th>Method</th><th>Status</th><th>Date</th></tr></thead>
          <tbody>
            <tr *ngFor="let p of payments">
              <td class="text-muted">#{{ p.id }}</td>
              <td>#{{ p.userId }}</td>
              <td>{{ p.courseName || 'Course #' + p.courseId }}</td>
              <td><strong>{{ p.amount | number:'1.2-2' }}</strong></td>
              <td>{{ p.paymentMethod || '—' }}</td>
              <td><span class="badge" [ngClass]="statusClass(p.status)">{{ p.status }}</span></td>
              <td class="text-muted text-sm">{{ p.createdAt | date:'mediumDate' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <app-empty-state *ngIf="!loading && payments.length === 0" icon="fa-credit-card" title="No payments" message="No payment records found." />
    </div>
  `,
  styles: [`
    .stats-mini-row { display: flex; gap: 16px; margin-bottom: 20px; flex-wrap: wrap; }
    .sm-stat { display: flex; align-items: center; gap: 14px; padding: 16px 20px; flex: 1; min-width: 160px; }
    .sm-stat i { font-size: 1.5rem; color: var(--primary); flex-shrink: 0; }
    .sm-val { font-family: var(--font-display); font-size: 1.4rem; font-weight: 700; }
    .sm-lbl { font-size: 0.78rem; color: var(--gray-500); }
  `]
})
export class AdminPaymentsComponent implements OnInit {
  payments: Payment[] = [];
  loading = true;
  constructor(private paymentService: PaymentService) {}
  ngOnInit() {
    this.paymentService.getAllPayments(0, 50).subscribe({ next: r => { this.payments = r.content || []; this.loading = false; }, error: () => { this.loading = false; } });
  }
  get totalRevenue() { return this.payments.filter(p => p.status === 'SUCCESS').reduce((s, p) => s + p.amount, 0); }
  get successCount() { return this.payments.filter(p => p.status === 'SUCCESS').length; }
  get failedCount()  { return this.payments.filter(p => p.status === 'FAILED').length; }
  statusClass(s: string) { return { SUCCESS: 'badge badge-success', PENDING: 'badge badge-warning', FAILED: 'badge badge-danger', REFUNDED: 'badge badge-gray' }[s] || 'badge badge-gray'; }
}
