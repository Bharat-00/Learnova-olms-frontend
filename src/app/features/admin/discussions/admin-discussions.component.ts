import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ConfirmationModalComponent } from '../../../shared/components/confirmation-modal/confirmation-modal.component';
import { DiscussionService } from '../../../core/services/discussion.service';
import { DiscussionThread } from '../../../core/models';

@Component({
  selector: 'app-admin-discussions',
  standalone: true,
  imports: [CommonModule, FormsModule, EmptyStateComponent, LoadingSpinnerComponent, ConfirmationModalComponent],
  template: `
    <div class="fade-in">
      <div class="page-header">
        <div><h1 class="page-title">Moderate Discussions</h1><p class="page-subtitle">Review and moderate all platform discussions</p></div>
      </div>

      <div class="toolbar">
        <input type="text" class="form-control" style="max-width:300px" [(ngModel)]="search" placeholder="Search threads...">
        <div class="total-badge badge badge-primary">{{ total }} threads total</div>
      </div>

      <div class="alert alert-success" *ngIf="successMsg"><i class="fas fa-check-circle"></i> {{ successMsg }}</div>
      <app-loading-spinner *ngIf="loading" />

      <div class="threads-container" *ngIf="!loading && filtered.length > 0">
        <div class="thread-admin-card card" *ngFor="let t of filtered">
          <div class="tac-header">
            <div class="avatar avatar-sm">{{ (t.authorName || 'U')[0] }}</div>
            <div class="tac-info">
              <span class="tac-author">{{ t.authorName || 'Unknown User' }}</span>
              <span class="tac-course">Course #{{ t.courseId }}</span>
              <span class="tac-time">{{ t.createdAt | date:'mediumDate' }}</span>
            </div>
            <div class="tac-badges">
              <span class="badge badge-primary" *ngIf="t.isPinned"><i class="fas fa-thumbtack"></i> Pinned</span>
              <span class="badge badge-warning" *ngIf="t.isLocked"><i class="fas fa-lock"></i> Locked</span>
            </div>
            <div class="tac-reply-count">
              <i class="fas fa-comment-dots"></i> {{ t.replyCount || 0 }}
            </div>
          </div>
          <h3 class="tac-title">{{ t.title }}</h3>
          <p class="tac-content">{{ t.content | slice:0:240 }}{{ t.content.length > 240 ? '...' : '' }}</p>
          <div class="tac-actions">
            <button class="btn btn-outline btn-sm" (click)="togglePin(t)" [title]="t.isPinned ? 'Unpin' : 'Pin'">
              <i class="fas fa-thumbtack"></i> {{ t.isPinned ? 'Unpin' : 'Pin' }}
            </button>
            <button class="btn btn-outline btn-sm" (click)="toggleLock(t)" [title]="t.isLocked ? 'Unlock' : 'Lock'">
              <i class="fas" [class.fa-lock-open]="t.isLocked" [class.fa-lock]="!t.isLocked"></i>
              {{ t.isLocked ? 'Unlock' : 'Lock' }}
            </button>
            <button class="btn btn-danger btn-sm" (click)="confirmDelete(t)">
              <i class="fas fa-trash-alt"></i> Delete
            </button>
          </div>
        </div>
      </div>

      <div class="pagination" *ngIf="totalPages > 1">
        <button class="page-btn" [disabled]="page === 0" (click)="changePage(page-1)"><i class="fas fa-chevron-left"></i></button>
        <button *ngFor="let p of pageArray" class="page-btn" [class.active]="p === page" (click)="changePage(p)">{{ p + 1 }}</button>
        <button class="page-btn" [disabled]="page === totalPages - 1" (click)="changePage(page+1)"><i class="fas fa-chevron-right"></i></button>
      </div>

      <app-empty-state *ngIf="!loading && filtered.length === 0"
        icon="fa-comments" title="No discussions found"
        message="No discussion threads match your search." />
    </div>

    <app-confirmation-modal [visible]="showModal"
      title="Delete Thread"
      [message]="'Permanently delete: ' + (toDelete?.title || '') + '? All replies will be removed.'"
      type="danger" confirmLabel="Delete Thread" [loading]="deleting"
      (confirm)="doDelete()" (cancel)="showModal = false" />
  `,
  styles: [`
    .toolbar { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }
    .total-badge { display: inline-flex; }
    .threads-container { display: flex; flex-direction: column; gap: 14px; }
    .thread-admin-card {}
    .tac-header { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; flex-wrap: wrap; }
    .tac-info { display: flex; align-items: center; gap: 8px; flex: 1; flex-wrap: wrap; }
    .tac-author { font-size: 0.875rem; font-weight: 600; color: var(--gray-800); }
    .tac-course, .tac-time { font-size: 0.75rem; color: var(--gray-400); }
    .tac-badges { display: flex; gap: 6px; }
    .tac-reply-count { font-size: 0.78rem; color: var(--gray-400); display: flex; align-items: center; gap: 4px; flex-shrink: 0; }
    .tac-title { font-size: 0.95rem; font-weight: 600; margin-bottom: 8px; color: var(--gray-800); }
    .tac-content { font-size: 0.85rem; color: var(--gray-500); line-height: 1.6; margin-bottom: 14px; }
    .tac-actions { display: flex; gap: 8px; flex-wrap: wrap; padding-top: 12px; border-top: 1px solid var(--gray-100); }
    .pagination { display: flex; justify-content: center; gap: 6px; margin-top: 20px; flex-wrap: wrap; }
    .page-btn { width: 36px; height: 36px; border: 1.5px solid var(--gray-200); border-radius: var(--radius); background: var(--white); font-size: 0.875rem; color: var(--gray-600); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: var(--transition); }
    .page-btn:hover:not(:disabled) { border-color: var(--primary); color: var(--primary); }
    .page-btn.active { background: var(--primary); border-color: var(--primary); color: #fff; }
    .page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  `]
})
export class AdminDiscussionsComponent implements OnInit {
  threads: DiscussionThread[] = [];
  loading = true;
  search = '';
  page = 0;
  totalPages = 0;
  total = 0;
  showModal = false;
  deleting = false;
  toDelete: DiscussionThread | null = null;
  successMsg = '';

  constructor(private discussionService: DiscussionService) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.discussionService.getAllThreads(this.page, 15).subscribe({
      next: res => {
        this.threads = res.content || [];
        this.totalPages = res.totalPages || 0;
        this.total = res.totalElements || 0;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  get filtered(): DiscussionThread[] {
    if (!this.search.trim()) return this.threads;
    const q = this.search.toLowerCase();
    return this.threads.filter(t => t.title.toLowerCase().includes(q) || t.content?.toLowerCase().includes(q));
  }

  changePage(p: number) { this.page = p; this.load(); }
  get pageArray() { return Array.from({ length: this.totalPages }, (_, i) => i); }

  togglePin(t: DiscussionThread) {
    this.discussionService.pinThread(t.id).subscribe({
      next: () => { t.isPinned = !t.isPinned; this.successMsg = `Thread ${t.isPinned ? 'pinned' : 'unpinned'}.`; setTimeout(() => this.successMsg = '', 3000); },
      error: () => {}
    });
  }

  toggleLock(t: DiscussionThread) {
    this.discussionService.lockThread(t.id).subscribe({
      next: () => { t.isLocked = !t.isLocked; this.successMsg = `Thread ${t.isLocked ? 'locked' : 'unlocked'}.`; setTimeout(() => this.successMsg = '', 3000); },
      error: () => {}
    });
  }

  confirmDelete(t: DiscussionThread) { this.toDelete = t; this.showModal = true; }

  doDelete() {
    if (!this.toDelete) return;
    this.deleting = true;
    this.discussionService.deleteThread(this.toDelete.id).subscribe({
      next: () => {
        this.threads = this.threads.filter(t => t.id !== this.toDelete!.id);
        this.total--;
        this.deleting = false; this.showModal = false;
        this.successMsg = 'Thread deleted successfully.';
        setTimeout(() => this.successMsg = '', 3000);
      },
      error: () => { this.deleting = false; }
    });
  }
}
