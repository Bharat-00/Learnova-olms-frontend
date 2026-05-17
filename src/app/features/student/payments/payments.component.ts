import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { PaymentService } from '../../../core/services/payment.service';
import { Payment, Subscription } from '../../../core/models';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingSpinnerComponent, EmptyStateComponent],
  template: `
    <div class="fade-in">
      <div class="page-header">
        <div>
          <h1 class="page-title">Payments & Billing</h1>
          <p class="page-subtitle">Your payment history and subscription details</p>
        </div>
      </div>

      <!-- Subscription Card -->
      <div class="subscription-card card fade-in-delay-1" *ngIf="subscription">
        <div class="sub-header">
          <div class="sub-icon"><i class="fas fa-layer-group"></i></div>
          <div class="sub-info">
            <div class="sub-plan">{{ subscription.plan }} Plan</div>
            <div class="sub-status badge" [ngClass]="subStatusClass(subscription.status)">
              {{ subscription.status }}
            </div>
          </div>
          <div class="sub-price">
            <span class="sub-amount">{{ subscription.price }}</span>
            <span class="sub-period">/month</span>
          </div>
        </div>
        <div class="sub-details">
          <div class="sub-detail">
            <span><i class="fas fa-calendar-alt"></i> Start Date</span>
            <strong>{{ subscription.startDate | date:'mediumDate' }}</strong>
          </div>
          <div class="sub-detail">
            <span><i class="fas fa-calendar-check"></i> Renewal Date</span>
            <strong>{{ subscription.endDate | date:'mediumDate' }}</strong>
          </div>
          <div class="sub-detail">
            <span><i class="fas fa-redo"></i> Auto Renew</span>
            <strong>{{ subscription.autoRenew ? 'Enabled' : 'Disabled' }}</strong>
          </div>
        </div>
        <div class="sub-actions">
          <button class="btn btn-outline btn-sm" (click)="cancelSub()" *ngIf="subscription.status === 'ACTIVE'">
            <i class="fas fa-ban"></i> Cancel Subscription
          </button>
          <a routerLink="/student/profile" class="btn btn-primary btn-sm">
            <i class="fas fa-arrow-up"></i> Upgrade Plan
          </a>
        </div>
      </div>

      <!-- Subscription Plans -->
      <div class="plans-section card fade-in-delay-2" *ngIf="!subscription">
        <h3>Choose a Plan</h3>
        <div class="plans-grid">
          <div class="plan-card" *ngFor="let plan of plans" [class.popular]="plan.popular">
            <div class="plan-popular-badge" *ngIf="plan.popular">Most Popular</div>
            <div class="plan-name">{{ plan.name }}</div>
            <div class="plan-price"><span class="plan-amount">{{ plan.price }}</span>/mo</div>
            <ul class="plan-features">
              <li *ngFor="let f of plan.features"><i class="fas fa-check text-success"></i> {{ f }}</li>
            </ul>
            <button class="btn btn-primary btn-sm" (click)="subscribe(plan.name)" style="width:100%">
              Get Started
            </button>
          </div>
        </div>
      </div>

      <!-- Payment History -->
      <div class="card fade-in-delay-3">
        <div class="card-head">
          <h3>Payment History</h3>
        </div>
        <app-loading-spinner *ngIf="loading" />
        <div class="table-container" *ngIf="!loading && payments.length > 0">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Course</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let p of payments">
                <td class="text-muted">#{{ p.id }}</td>
                <td>{{ p.courseName || 'Course #' + p.courseId }}</td>
                <td><strong>{{ p.amount | number:'1.2-2' }}</strong></td>
                <td>{{ p.paymentMethod || '—' }}</td>
                <td>
                  <span class="badge" [ngClass]="payStatusClass(p.status)">{{ p.status }}</span>
                </td>
                <td class="text-muted">{{ p.createdAt | date:'mediumDate' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <app-empty-state *ngIf="!loading && payments.length === 0"
          icon="fa-credit-card" title="No payments yet"
          message="Your payment history will appear here after you make a purchase." />
      </div>
    </div>
  `,
  styles: [`
    .card-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .card-head h3 { font-size: 1rem; font-weight: 600; }
    .subscription-card { margin-bottom: 20px; }
    .sub-header { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; }
    .sub-icon { width: 52px; height: 52px; border-radius: 14px; background: var(--primary-light); color: var(--primary); display: flex; align-items: center; justify-content: center; font-size: 1.3rem; flex-shrink: 0; }
    .sub-info { flex: 1; }
    .sub-plan { font-size: 1.1rem; font-weight: 700; color: var(--gray-900); }
    .sub-status { margin-top: 4px; display: inline-flex; }
    .sub-price { text-align: right; }
    .sub-amount { font-family: var(--font-display); font-size: 1.8rem; font-weight: 800; color: var(--gray-900); }
    .sub-period { font-size: 0.85rem; color: var(--gray-500); }
    .sub-details { display: flex; gap: 24px; padding: 16px 0; border-top: 1px solid var(--gray-100); border-bottom: 1px solid var(--gray-100); margin-bottom: 16px; flex-wrap: wrap; }
    .sub-detail { display: flex; flex-direction: column; gap: 4px; }
    .sub-detail span { font-size: 0.8rem; color: var(--gray-500); display: flex; align-items: center; gap: 6px; }
    .sub-detail strong { font-size: 0.9rem; }
    .sub-actions { display: flex; gap: 10px; }
    .plans-section h3 { margin-bottom: 20px; }
    .plans-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
    .plan-card { border: 1.5px solid var(--gray-200); border-radius: var(--radius-lg); padding: 24px; position: relative; transition: var(--transition); }
    .plan-card.popular { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(26,107,255,0.1); }
    .plan-popular-badge { position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background: var(--primary); color: #fff; font-size: 0.72rem; font-weight: 700; padding: 4px 14px; border-radius: var(--radius-full); white-space: nowrap; }
    .plan-name { font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--primary); margin-bottom: 8px; }
    .plan-price { margin-bottom: 16px; }
    .plan-amount { font-family: var(--font-display); font-size: 2rem; font-weight: 800; }
    .plan-features { list-style: none; display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; }
    .plan-features li { font-size: 0.85rem; color: var(--gray-600); display: flex; align-items: center; gap: 8px; }
    .text-success { color: var(--success); }
    .badge-success { background: var(--success-light); color: #059669; }
    .badge-warning { background: var(--warning-light); color: #d97706; }
    .badge-danger  { background: var(--danger-light);  color: var(--danger); }
    .badge-gray    { background: var(--gray-100); color: var(--gray-600); }
    @media (max-width: 768px) { .plans-grid { grid-template-columns: 1fr; } }
  `]
})
export class PaymentsComponent implements OnInit {
  payments: Payment[] = [];
  subscription: Subscription | null = null;
  loading = true;

  plans = [
    { name: 'BASIC', price: 9, popular: false, features: ['10 courses/month', 'Certificate access', 'Community forum'] },
    { name: 'PRO', price: 29, popular: true, features: ['Unlimited courses', 'Certificates', 'Priority support', 'Downloadable resources', 'Offline access'] },
    { name: 'ENTERPRISE', price: 99, popular: false, features: ['Everything in Pro', 'Team management', 'Analytics dashboard', 'Dedicated support'] }
  ];

  constructor(private paymentService: PaymentService) {}

  ngOnInit() {
    this.paymentService.getMyPayments().subscribe({
      next: data => { this.payments = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
    this.paymentService.getMySubscription().subscribe({
      next: sub => this.subscription = sub,
      error: () => {}
    });
  }

  subscribe(plan: string) {
    this.paymentService.subscribeToPlan(plan).subscribe({
      next: sub => this.subscription = sub,
      error: () => {}
    });
  }

  cancelSub() {
    this.paymentService.cancelSubscription().subscribe({
      next: () => { if (this.subscription) this.subscription.status = 'CANCELLED'; },
      error: () => {}
    });
  }

  subStatusClass(status: string): string {
    return { ACTIVE: 'badge badge-success', EXPIRED: 'badge badge-warning', CANCELLED: 'badge badge-gray' }[status] || 'badge badge-gray';
  }

  payStatusClass(status: string): string {
    return { SUCCESS: 'badge badge-success', PENDING: 'badge badge-warning', FAILED: 'badge badge-danger', REFUNDED: 'badge badge-gray' }[status] || 'badge badge-gray';
  }
}
