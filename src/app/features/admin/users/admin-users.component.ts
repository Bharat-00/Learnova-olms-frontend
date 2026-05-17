import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { ConfirmationModalComponent } from '../../../shared/components/confirmation-modal/confirmation-modal.component';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent, EmptyStateComponent, ConfirmationModalComponent],
  template: `
    <div class="fade-in">
      <div class="page-header">
        <div><h1 class="page-title">Manage Users</h1><p class="page-subtitle">View and manage all registered users</p></div>
      </div>

      <div class="toolbar">
        <input type="text" class="form-control" style="max-width:300px" [(ngModel)]="search" (input)="onSearch()" placeholder="Search by name or email...">
        <select class="form-control form-select" style="width:160px" [(ngModel)]="roleFilter" (change)="onSearch()">
          <option value="">All Roles</option>
          <option value="STUDENT">Students</option>
          <option value="INSTRUCTOR">Instructors</option>
          <option value="ADMIN">Admins</option>
        </select>
        <div class="total-label">{{ totalElements }} users total</div>
      </div>

      <div class="alert alert-success" *ngIf="successMsg"><i class="fas fa-check-circle"></i> {{ successMsg }}</div>

      <app-loading-spinner *ngIf="loading" />

      <div class="table-container" *ngIf="!loading && users.length > 0">
        <table>
          <thead>
            <tr><th>User</th><th>Role</th><th>Email</th><th>Status</th><th>Joined</th><th>Actions</th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let u of users">
              <td>
                <div class="user-cell">
                  <div class="avatar avatar-sm">{{ u.firstName[0] }}{{ u.lastName[0] }}</div>
                  <div>
                    <div class="user-fullname">{{ u.firstName }} {{ u.lastName }}</div>
                    <div class="user-id">#{{ u.id }}</div>
                  </div>
                </div>
              </td>
              <td><span class="badge badge-primary">{{ u.role }}</span></td>
              <td class="text-muted">{{ u.email }}</td>
              <td>
                <span class="badge" [ngClass]="u.active !== false ? 'badge-success' : 'badge-danger'">
                  {{ u.active !== false ? 'Active' : 'Suspended' }}
                </span>
              </td>
              <td class="text-muted text-sm">{{ u.createdAt | date:'mediumDate' }}</td>
              <td>
                <div class="action-btns">
                  <button class="btn btn-sm"
                          [ngClass]="u.active !== false ? 'btn-warning' : 'btn-success'"
                          (click)="toggleStatus(u)"
                          [title]="u.active !== false ? 'Suspend' : 'Activate'">
                    <i class="fas" [class.fa-ban]="u.active !== false" [class.fa-check]="u.active === false"></i>
                  </button>
                  <button class="btn btn-danger btn-sm" (click)="confirmDelete(u)" title="Delete">
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="pagination" *ngIf="totalPages > 1">
        <button class="page-btn" [disabled]="page === 0" (click)="changePage(page - 1)"><i class="fas fa-chevron-left"></i></button>
        <button *ngFor="let p of pageArray" class="page-btn" [class.active]="p === page" (click)="changePage(p)">{{ p + 1 }}</button>
        <button class="page-btn" [disabled]="page === totalPages - 1" (click)="changePage(page + 1)"><i class="fas fa-chevron-right"></i></button>
      </div>

      <app-empty-state *ngIf="!loading && users.length === 0" icon="fa-users" title="No users found" message="No users match your current search or filter." />
    </div>

    <app-confirmation-modal [visible]="showModal" title="Delete User"
      [message]="'Permanently delete ' + (toDelete?.firstName || '') + ' ' + (toDelete?.lastName || '') + '? This cannot be undone.'"
      type="danger" confirmLabel="Delete User" [loading]="deleting"
      (confirm)="doDelete()" (cancel)="showModal = false" />
  `,
  styles: [`
    .toolbar { display: flex; gap: 12px; margin-bottom: 20px; align-items: center; flex-wrap: wrap; }
    .total-label { font-size: 0.82rem; color: var(--gray-500); margin-left: auto; }
    .user-cell { display: flex; align-items: center; gap: 10px; }
    .user-fullname { font-size: 0.875rem; font-weight: 500; }
    .user-id { font-size: 0.72rem; color: var(--gray-400); }
    .action-btns { display: flex; gap: 6px; }
    .btn-warning { background: var(--warning); color: #fff; border-color: var(--warning); }
    .btn-warning:hover { background: #d97706; }
    .pagination { display: flex; justify-content: center; gap: 6px; margin-top: 20px; flex-wrap: wrap; }
    .page-btn { width: 36px; height: 36px; border: 1.5px solid var(--gray-200); border-radius: var(--radius); background: var(--white); font-size: 0.875rem; color: var(--gray-600); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: var(--transition); }
    .page-btn:hover:not(:disabled) { border-color: var(--primary); color: var(--primary); }
    .page-btn.active { background: var(--primary); border-color: var(--primary); color: #fff; }
    .page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  `]
})
export class AdminUsersComponent implements OnInit {
  users: User[] = [];
  loading = true;
  page = 0;
  totalPages = 0;
  totalElements = 0;
  search = '';
  roleFilter = '';
  showModal = false;
  deleting = false;
  toDelete: User | null = null;
  successMsg = '';

  constructor(private userService: UserService) {}

  ngOnInit() { this.loadUsers(); }

  loadUsers() {
    this.loading = true;
    this.userService.getAllUsers(this.page, 15).subscribe({
      next: res => { this.users = res.content || []; this.totalPages = res.totalPages || 0; this.totalElements = res.totalElements || 0; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  onSearch() {
    if (this.search.trim()) {
      this.userService.searchUsers(this.search).subscribe({ next: data => this.users = data, error: () => {} });
    } else { this.loadUsers(); }
  }

  toggleStatus(u: User) {
    const action = u.active !== false ? this.userService.suspendUser(u.id) : this.userService.activateUser(u.id);
    action.subscribe({
      next: () => {
        u.active = u.active === false ? true : false;
        this.successMsg = `User ${u.active ? 'activated' : 'suspended'}.`;
        setTimeout(() => this.successMsg = '', 3000);
      },
      error: () => {}
    });
  }

  confirmDelete(u: User) { this.toDelete = u; this.showModal = true; }

  doDelete() {
    if (!this.toDelete) return;
    this.deleting = true;
    this.userService.deleteUser(this.toDelete.id).subscribe({
      next: () => {
        this.users = this.users.filter(u => u.id !== this.toDelete!.id);
        this.totalElements--;
        this.deleting = false; this.showModal = false;
        this.successMsg = 'User deleted successfully.';
        setTimeout(() => this.successMsg = '', 3000);
      },
      error: () => { this.deleting = false; }
    });
  }

  changePage(p: number) { this.page = p; this.loadUsers(); }
  get pageArray() { return Array.from({ length: this.totalPages }, (_, i) => i); }
}
