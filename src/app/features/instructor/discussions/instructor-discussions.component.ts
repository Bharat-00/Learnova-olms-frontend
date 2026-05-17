import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ConfirmationModalComponent } from '../../../shared/components/confirmation-modal/confirmation-modal.component';
import { DiscussionService } from '../../../core/services/discussion.service';
import { DiscussionThread } from '../../../core/models';

@Component({
  selector: 'app-instructor-discussions',
  standalone: true,
  imports: [CommonModule, EmptyStateComponent, LoadingSpinnerComponent, ConfirmationModalComponent],
  template: `
    <div class="fade-in">
      <div class="page-header">
        <div>
          <h1 class="page-title">Moderate Discussions</h1>
          <p class="page-subtitle">Review and manage course discussion threads</p>
        </div>
      </div>
      <app-loading-spinner *ngIf="loading" />
      <div class="threads-list" *ngIf="!loading && threads.length > 0">
        <div class="thread-mod-card card" *ngFor="let t of threads">
          <div class="tm-header">
            <div class="avatar avatar-sm">{{ t.authorName?.[0] || 'U' }}</div>
            <div class="tm-meta">
              <strong>{{ t.authorName || 'User' }}</strong>
              <span class="tm-time">{{ t.createdAt | date:'mediumDate' }}</span>
            </div>
            <div class="tm-badges">
              <span class="badge badge-primary" *ngIf="t.isPinned"><i class="fas fa-thumbtack"></i> Pinned</span>
              <span class="badge badge-warning" *ngIf="t.isLocked"><i class="fas fa-lock"></i> Locked</span>
            </div>
          </div>
          <h3 class="tm-title">{{ t.title }}</h3>
          <p class="tm-content">{{ t.content | slice:0:200 }}...</p>
          <div class="tm-stats">
            <span><i class="fas fa-comment-dots"></i> {{ t.replyCount || 0 }} replies</span>
          </div>
          <div class="tm-actions">
            <button class="btn btn-outline btn-sm" (click)="togglePin(t)">
              <i class="fas fa-thumbtack"></i> {{ t.isPinned ? 'Unpin' : 'Pin' }}
            </button>
            <button class="btn btn-outline btn-sm" (click)="toggleLock(t)">
              <i class="fas" [class.fa-lock-open]="t.isLocked" [class.fa-lock]="!t.isLocked"></i>
              {{ t.isLocked ? 'Unlock' : 'Lock' }}
            </button>
            <button class="btn btn-danger btn-sm" (click)="confirmDelete(t)">
              <i class="fas fa-trash-alt"></i> Delete
            </button>
          </div>
        </div>
      </div>
      <app-empty-state *ngIf="!loading && threads.length === 0" icon="fa-comments" title="No discussions" message="No discussion threads yet." />
    </div>
    <app-confirmation-modal [visible]="showModal" title="Delete Thread" [message]="'Delete: ' + (toDelete?.title || '') + '?'"
      type="danger" confirmLabel="Delete" [loading]="deleting" (confirm)="doDelete()" (cancel)="showModal = false" />
  `,
  styles: [`
    .threads-list { display: flex; flex-direction: column; gap: 14px; }
    .thread-mod-card {}
    .tm-header { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
    .tm-meta { flex: 1; display: flex; align-items: center; gap: 8px; }
    .tm-meta strong { font-size: 0.875rem; }
    .tm-time { font-size: 0.75rem; color: var(--gray-400); }
    .tm-badges { display: flex; gap: 6px; }
    .tm-title { font-size: 0.95rem; font-weight: 600; margin-bottom: 6px; }
    .tm-content { font-size: 0.85rem; color: var(--gray-500); line-height: 1.5; margin-bottom: 10px; }
    .tm-stats { font-size: 0.78rem; color: var(--gray-400); margin-bottom: 12px; display: flex; gap: 12px; }
    .tm-stats span { display: flex; align-items: center; gap: 5px; }
    .tm-actions { display: flex; gap: 8px; flex-wrap: wrap; border-top: 1px solid var(--gray-100); padding-top: 12px; }
  `]
})
export class InstructorDiscussionsComponent implements OnInit {
  threads: DiscussionThread[] = [];
  loading = true;
  showModal = false;
  deleting = false;
  toDelete: DiscussionThread | null = null;

  constructor(private discussionService: DiscussionService) {}

  ngOnInit() {
    this.discussionService.getAllThreads().subscribe({
      next: res => { this.threads = res.content || []; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  togglePin(t: DiscussionThread) {
    this.discussionService.pinThread(t.id).subscribe({ next: () => { t.isPinned = !t.isPinned; }, error: () => {} });
  }

  toggleLock(t: DiscussionThread) {
    this.discussionService.lockThread(t.id).subscribe({ next: () => { t.isLocked = !t.isLocked; }, error: () => {} });
  }

  confirmDelete(t: DiscussionThread) { this.toDelete = t; this.showModal = true; }

  doDelete() {
    if (!this.toDelete) return;
    this.deleting = true;
    this.discussionService.deleteThread(this.toDelete.id).subscribe({
      next: () => { this.threads = this.threads.filter(t => t.id !== this.toDelete!.id); this.deleting = false; this.showModal = false; },
      error: () => { this.deleting = false; }
    });
  }
}
