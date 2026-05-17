import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StatsCardComponent } from '../../../shared/components/stats-card/stats-card.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { UserService } from '../../../core/services/user.service';
import { CourseService } from '../../../core/services/course.service';
import { PaymentService } from '../../../core/services/payment.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, StatsCardComponent, LoadingSpinnerComponent],
  template: `
    <div class="fade-in">
      <div class="page-header">
        <div>
          <h1 class="page-title">Admin Dashboard</h1>
          <p class="page-subtitle">Platform overview and management tools</p>
        </div>
        <a routerLink="/admin/notifications" class="btn btn-primary">
          <i class="fas fa-bullhorn"></i> Send Notification
        </a>
      </div>

      <div class="stats-grid fade-in-delay-1">
        <app-stats-card label="Total Users"    [value]="stats.totalUsers"    icon="fa-users"       color="var(--primary)" />
        <app-stats-card label="Total Courses"  [value]="stats.totalCourses"  icon="fa-book"        color="var(--success)" />
        <app-stats-card label="Revenue"        [value]="'$' + stats.revenue" icon="fa-dollar-sign" color="var(--warning)" />
        <app-stats-card label="Pending Review" [value]="stats.pending"       icon="fa-clock"       color="var(--danger)" />
      </div>

      <div class="admin-grid fade-in-delay-2">
        <!-- Recent Users -->
        <div class="card">
          <div class="card-head">
            <h3>Recent Users</h3>
            <a routerLink="/admin/users" class="view-all">View All</a>
          </div>
          <div class="table-container">
            <table>
              <thead><tr><th>Name</th><th>Role</th><th>Status</th></tr></thead>
              <tbody>
                <tr *ngFor="let u of recentUsers">
                  <td>
                    <div class="user-cell">
                      <div class="avatar avatar-sm">{{ u.firstName[0] }}</div>
                      <div>
                        <div class="user-name-cell">{{ u.firstName }} {{ u.lastName }}</div>
                        <div class="user-email-cell">{{ u.email }}</div>
                      </div>
                    </div>
                  </td>
                  <td><span class="badge badge-primary">{{ u.role }}</span></td>
                  <td><span class="badge" [ngClass]="u.active !== false ? 'badge-success' : 'badge-danger'">{{ u.active !== false ? 'Active' : 'Suspended' }}</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="card">
          <h3 class="qa-title">Admin Actions</h3>
          <div class="admin-actions-list">
            <a routerLink="/admin/users"    class="admin-action-item"><div class="aai-icon primary"><i class="fas fa-users"></i></div><div class="aai-info"><div class="aai-label">Manage Users</div><div class="aai-desc">View, suspend or delete users</div></div><i class="fas fa-chevron-right aai-arrow"></i></a>
            <a routerLink="/admin/courses"  class="admin-action-item"><div class="aai-icon success"><i class="fas fa-book"></i></div><div class="aai-info"><div class="aai-label">Approve Courses</div><div class="aai-desc">Review pending course submissions</div></div><i class="fas fa-chevron-right aai-arrow"></i></a>
            <a routerLink="/admin/payments" class="admin-action-item"><div class="aai-icon warning"><i class="fas fa-credit-card"></i></div><div class="aai-info"><div class="aai-label">View Payments</div><div class="aai-desc">Monitor transactions and revenue</div></div><i class="fas fa-chevron-right aai-arrow"></i></a>
            <a routerLink="/admin/analytics" class="admin-action-item"><div class="aai-icon info"><i class="fas fa-chart-pie"></i></div><div class="aai-info"><div class="aai-label">Analytics</div><div class="aai-desc">Platform performance metrics</div></div><i class="fas fa-chevron-right aai-arrow"></i></a>
            <a routerLink="/admin/notifications" class="admin-action-item"><div class="aai-icon danger"><i class="fas fa-bullhorn"></i></div><div class="aai-info"><div class="aai-label">Send Notification</div><div class="aai-desc">Broadcast announcements to users</div></div><i class="fas fa-chevron-right aai-arrow"></i></a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-grid { display: grid; grid-template-columns: 1fr 340px; gap: 20px; }
    .card-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .card-head h3 { font-size: 1rem; font-weight: 600; }
    .view-all { font-size: 0.82rem; color: var(--primary); font-weight: 500; }
    .user-cell { display: flex; align-items: center; gap: 10px; }
    .user-name-cell { font-size: 0.875rem; font-weight: 500; }
    .user-email-cell { font-size: 0.75rem; color: var(--gray-400); }
    .qa-title { font-size: 1rem; font-weight: 600; margin-bottom: 16px; }
    .admin-actions-list { display: flex; flex-direction: column; gap: 4px; }
    .admin-action-item { display: flex; align-items: center; gap: 12px; padding: 12px 10px; border-radius: var(--radius); text-decoration: none; transition: var(--transition); }
    .admin-action-item:hover { background: var(--gray-50); }
    .aai-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 0.95rem; flex-shrink: 0; }
    .aai-icon.primary { background: var(--primary-light); color: var(--primary); }
    .aai-icon.success { background: var(--success-light); color: var(--success); }
    .aai-icon.warning { background: var(--warning-light); color: var(--warning); }
    .aai-icon.info    { background: var(--info-light); color: var(--info); }
    .aai-icon.danger  { background: var(--danger-light); color: var(--danger); }
    .aai-info { flex: 1; }
    .aai-label { font-size: 0.875rem; font-weight: 600; color: var(--gray-800); }
    .aai-desc { font-size: 0.75rem; color: var(--gray-500); }
    .aai-arrow { color: var(--gray-300); font-size: 0.75rem; }
    @media (max-width: 900px) { .admin-grid { grid-template-columns: 1fr; } }
  `]
})
export class AdminDashboardComponent implements OnInit {
  stats = { totalUsers: 0, totalCourses: 0, revenue: '0', pending: 0 };
  recentUsers: any[] = [];
  loading = true;

  constructor(private userService: UserService, private courseService: CourseService, private paymentService: PaymentService) {}

  ngOnInit() {
    this.userService.getAllUsers(0, 5).subscribe({
      next: res => { this.recentUsers = res.content || []; this.stats.totalUsers = res.totalElements || 0; this.loading = false; },
      error: () => { this.loading = false; }
    });
    this.courseService.getAllCourses({ size: 1 }).subscribe({
      next: res => { this.stats.totalCourses = res.totalElements || 0; },
      error: () => {}
    });
    this.paymentService.getPaymentStats().subscribe({
      next: s => { this.stats.revenue = s.totalRevenue || '0'; this.stats.pending = s.pendingCount || 0; },
      error: () => {}
    });
  }
}
