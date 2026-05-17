import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsCardComponent } from '../../../shared/components/stats-card/stats-card.component';
import { UserService } from '../../../core/services/user.service';
import { PaymentService } from '../../../core/services/payment.service';

@Component({
  selector: 'app-admin-analytics',
  standalone: true,
  imports: [CommonModule, StatsCardComponent],
  template: `
    <div class="fade-in">
      <div class="page-header"><div><h1 class="page-title">Platform Analytics</h1><p class="page-subtitle">Insights and performance metrics</p></div></div>

      <div class="stats-grid fade-in-delay-1">
        <app-stats-card label="Total Users"    [value]="platformStats.totalUsers"    icon="fa-users"       color="var(--primary)"  change="+12% this month" [changePositive]="true" />
        <app-stats-card label="Total Revenue"  [value]="'$' + platformStats.revenue" icon="fa-dollar-sign" color="var(--success)"  change="+8% this month"  [changePositive]="true" />
        <app-stats-card label="Active Courses" [value]="platformStats.activeCourses" icon="fa-book"        color="var(--warning)"  change="+5 this week"    [changePositive]="true" />
        <app-stats-card label="Certificates"   [value]="platformStats.certificates"  icon="fa-certificate" color="var(--info)"     change="+3% this month"  [changePositive]="true" />
      </div>

      <div class="analytics-sections">
        <!-- Role Breakdown -->
        <div class="card fade-in-delay-2">
          <h3 class="analytics-section-title">User Role Breakdown</h3>
          <div class="role-bars">
            <div class="role-bar-item" *ngFor="let rb of roleBars">
              <div class="rb-label">
                <span>{{ rb.label }}</span>
                <strong>{{ rb.count }}</strong>
              </div>
              <div class="progress-bar-container" style="height:10px">
                <div class="progress-bar-fill" [style.width]="rb.pct + '%'" [style.background]="rb.color"></div>
              </div>
              <span class="rb-pct">{{ rb.pct }}%</span>
            </div>
          </div>
        </div>

        <!-- Platform Health -->
        <div class="card fade-in-delay-3">
          <h3 class="analytics-section-title">Platform Health</h3>
          <div class="health-grid">
            <div class="health-item" *ngFor="let h of healthMetrics">
              <div class="hi-icon" [ngClass]="h.status"><i class="fas {{ h.icon }}"></i></div>
              <div><div class="hi-label">{{ h.label }}</div><div class="hi-value" [ngClass]="h.status">{{ h.value }}</div></div>
            </div>
          </div>
        </div>
      </div>

      <div class="card fade-in-delay-4">
        <h3 class="analytics-section-title">Advanced Analytics</h3>
        <div class="placeholder-chart">
          <i class="fas fa-chart-bar placeholder-chart-icon"></i>
          <p>Detailed charts for enrollment trends, revenue over time, and course completion rates will be rendered here when integrated with a charting library (e.g., Chart.js or D3.js).</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .analytics-sections { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
    .analytics-section-title { font-size: 0.95rem; font-weight: 700; margin-bottom: 20px; }
    .role-bars { display: flex; flex-direction: column; gap: 16px; }
    .role-bar-item { display: flex; align-items: center; gap: 12px; }
    .rb-label { display: flex; justify-content: space-between; width: 140px; font-size: 0.82rem; color: var(--gray-600); flex-shrink: 0; }
    .rb-label strong { color: var(--gray-800); }
    .rb-pct { font-size: 0.78rem; font-weight: 600; color: var(--gray-500); width: 36px; text-align: right; flex-shrink: 0; }
    .health-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
    .health-item { display: flex; align-items: center; gap: 12px; padding: 12px; background: var(--gray-50); border-radius: var(--radius); }
    .hi-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 0.9rem; flex-shrink: 0; }
    .hi-icon.good { background: var(--success-light); color: var(--success); }
    .hi-icon.warn { background: var(--warning-light); color: var(--warning); }
    .hi-icon.bad  { background: var(--danger-light); color: var(--danger); }
    .hi-label { font-size: 0.78rem; color: var(--gray-500); }
    .hi-value { font-size: 0.875rem; font-weight: 700; }
    .hi-value.good { color: var(--success); }
    .hi-value.warn { color: var(--warning); }
    .hi-value.bad  { color: var(--danger); }
    .placeholder-chart { text-align: center; padding: 48px 24px; background: var(--gray-50); border-radius: var(--radius); }
    .placeholder-chart-icon { font-size: 3.5rem; color: var(--gray-300); display: block; margin-bottom: 16px; }
    .placeholder-chart p { font-size: 0.875rem; color: var(--gray-400); max-width: 500px; margin: 0 auto; line-height: 1.7; }
    @media (max-width: 768px) { .analytics-sections { grid-template-columns: 1fr; } }
  `]
})
export class AdminAnalyticsComponent implements OnInit {
  platformStats = { totalUsers: 0, revenue: '0', activeCourses: 0, certificates: 0 };
  roleBars = [
    { label: 'Students', count: 0, pct: 0, color: 'var(--primary)' },
    { label: 'Instructors', count: 0, pct: 0, color: 'var(--success)' },
    { label: 'Admins', count: 0, pct: 0, color: 'var(--warning)' }
  ];
  healthMetrics = [
    { icon: 'fa-server',     label: 'API Gateway',     value: 'Operational', status: 'good' },
    { icon: 'fa-database',   label: 'Database',        value: 'Healthy',     status: 'good' },
    { icon: 'fa-envelope',   label: 'RabbitMQ',        value: 'Running',     status: 'good' },
    { icon: 'fa-tachometer-alt', label: 'Redis Cache', value: 'Connected',   status: 'good' },
    { icon: 'fa-shield-alt', label: 'Auth Service',    value: 'Secure',      status: 'good' },
    { icon: 'fa-globe',      label: 'Eureka Server',   value: 'Active',      status: 'good' }
  ];

  constructor(private userService: UserService, private paymentService: PaymentService) {}

  ngOnInit() {
    this.userService.getPlatformStats().subscribe({
      next: s => {
        this.platformStats.totalUsers = s.totalUsers || 0;
        this.platformStats.activeCourses = s.activeCourses || 0;
        this.platformStats.certificates = s.totalCertificates || 0;
        const total = s.totalUsers || 1;
        this.roleBars[0].count = s.students || 0; this.roleBars[0].pct = Math.round(((s.students || 0) / total) * 100);
        this.roleBars[1].count = s.instructors || 0; this.roleBars[1].pct = Math.round(((s.instructors || 0) / total) * 100);
        this.roleBars[2].count = s.admins || 0; this.roleBars[2].pct = Math.round(((s.admins || 0) / total) * 100);
      },
      error: () => {}
    });
    this.paymentService.getPaymentStats().subscribe({
      next: s => this.platformStats.revenue = (s.totalRevenue || 0).toFixed(2),
      error: () => {}
    });
  }
}
