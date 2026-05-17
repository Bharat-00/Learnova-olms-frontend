import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { DiscussionService } from '../../../core/services/discussion.service';
import { AuthService } from '../../../core/services/auth.service';
import { DiscussionThread, Reply } from '../../../core/models';

@Component({
  selector: 'app-discussions',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent, EmptyStateComponent],
  template: `
    <div class="fade-in">
      <div class="page-header">
        <div>
          <h1 class="page-title">Discussion Forum</h1>
          <p class="page-subtitle">Ask questions and interact with the community</p>
        </div>
        <button class="btn btn-primary" (click)="showNewThread = !showNewThread">
          <i class="fas fa-plus"></i> New Thread
        </button>
      </div>

      <!-- New Thread Form -->
      <div class="card new-thread-form fade-in" *ngIf="showNewThread">
        <h3>Start a New Thread</h3>
        <div class="form-group">
          <label class="form-label">Title</label>
          <input type="text" class="form-control" [(ngModel)]="newThread.title" placeholder="What's your question?">
        </div>
        <div class="form-group">
          <label class="form-label">Content</label>
          <textarea class="form-control" [(ngModel)]="newThread.content" rows="4" placeholder="Describe your question in detail..."></textarea>
        </div>
        <div class="form-actions">
          <button class="btn btn-secondary" (click)="showNewThread = false">Cancel</button>
          <button class="btn btn-primary" (click)="postThread()" [disabled]="posting">
            <span *ngIf="posting" class="spinner-sm"></span>
            <i *ngIf="!posting" class="fas fa-paper-plane"></i>
            {{ posting ? 'Posting...' : 'Post Thread' }}
          </button>
        </div>
      </div>

      <app-loading-spinner *ngIf="loading" />

      <div class="discussions-layout" *ngIf="!loading">
        <!-- Threads List -->
        <div class="threads-list" *ngIf="!activeThread">
          <app-empty-state *ngIf="threads.length === 0"
            icon="fa-comments" title="No discussions yet"
            message="Be the first to start a conversation!"
            actionLabel="Start Thread" (action)="showNewThread = true" />

          <div class="thread-card card" *ngFor="let t of threads" (click)="openThread(t)">
            <div class="thread-header">
              <div class="avatar">{{ t.authorName?.[0] || 'U' }}</div>
              <div class="thread-meta">
                <div class="thread-author">{{ t.authorName || 'User' }}</div>
                <div class="thread-time">{{ t.createdAt | date:'mediumDate' }}</div>
              </div>
              <div class="thread-badges">
                <span class="badge badge-primary" *ngIf="t.isPinned"><i class="fas fa-thumbtack"></i> Pinned</span>
                <span class="badge badge-gray" *ngIf="t.isLocked"><i class="fas fa-lock"></i> Locked</span>
              </div>
            </div>
            <h3 class="thread-title">{{ t.title }}</h3>
            <p class="thread-preview">{{ t.content | slice:0:160 }}{{ t.content.length > 160 ? '...' : '' }}</p>
            <div class="thread-footer">
              <span><i class="fas fa-comment-dots"></i> {{ t.replyCount || 0 }} replies</span>
              <span class="thread-read-more">Read More <i class="fas fa-arrow-right"></i></span>
            </div>
          </div>
        </div>

        <!-- Thread Detail -->
        <div class="thread-detail" *ngIf="activeThread">
          <button class="btn btn-secondary btn-sm back-btn" (click)="activeThread = null">
            <i class="fas fa-arrow-left"></i> Back to Threads
          </button>

          <div class="card thread-detail-card">
            <div class="thread-detail-header">
              <div class="avatar">{{ activeThread.authorName?.[0] || 'U' }}</div>
              <div>
                <div class="thread-detail-author">{{ activeThread.authorName || 'User' }}</div>
                <div class="thread-detail-time">{{ activeThread.createdAt | date:'medium' }}</div>
              </div>
            </div>
            <h2 class="thread-detail-title">{{ activeThread.title }}</h2>
            <p class="thread-detail-content">{{ activeThread.content }}</p>
          </div>

          <!-- Replies -->
          <div class="replies-section">
            <h3 class="replies-heading">{{ replies.length }} Replies</h3>
            <div class="reply-card card" *ngFor="let r of replies">
              <div class="reply-header">
                <div class="avatar avatar-sm">{{ r.authorName?.[0] || 'U' }}</div>
                <div>
                  <div class="reply-author">
                    {{ r.authorName || 'User' }}
                    <span class="instructor-tag" *ngIf="r.isInstructor">Instructor</span>
                  </div>
                  <div class="reply-time">{{ r.createdAt | date:'medium' }}</div>
                </div>
              </div>
              <p class="reply-content">{{ r.content }}</p>
            </div>

            <!-- Reply Form -->
            <div class="card reply-form" *ngIf="!activeThread.isLocked">
              <h4>Add a Reply</h4>
              <textarea class="form-control" [(ngModel)]="replyContent" rows="3" placeholder="Write your reply..."></textarea>
              <button class="btn btn-primary btn-sm" style="margin-top:10px" (click)="postReply()" [disabled]="!replyContent.trim() || postingReply">
                <span *ngIf="postingReply" class="spinner-sm"></span>
                <i *ngIf="!postingReply" class="fas fa-paper-plane"></i>
                {{ postingReply ? 'Posting...' : 'Post Reply' }}
              </button>
            </div>
            <div class="locked-notice" *ngIf="activeThread.isLocked">
              <i class="fas fa-lock"></i> This thread is locked and no longer accepts replies.
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .new-thread-form { margin-bottom: 20px; }
    .new-thread-form h3 { margin-bottom: 16px; font-size: 1rem; font-weight: 600; }
    .form-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 4px; }
    .spinner-sm { display: inline-block; width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.4); border-top-color: #fff; border-radius: 50%; animation: spin 0.6s linear infinite; }
    .thread-card { cursor: pointer; transition: var(--transition); }
    .thread-card:hover { border-color: var(--primary); box-shadow: var(--shadow); transform: translateY(-1px); }
    .thread-header { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
    .thread-meta { flex: 1; }
    .thread-author { font-size: 0.875rem; font-weight: 600; }
    .thread-time { font-size: 0.75rem; color: var(--gray-400); }
    .thread-badges { display: flex; gap: 6px; }
    .thread-title { font-size: 1rem; font-weight: 600; margin-bottom: 8px; color: var(--gray-800); }
    .thread-preview { font-size: 0.875rem; color: var(--gray-500); line-height: 1.6; margin-bottom: 12px; }
    .thread-footer { display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--gray-400); padding-top: 12px; border-top: 1px solid var(--gray-100); }
    .thread-footer span { display: flex; align-items: center; gap: 5px; }
    .thread-read-more { color: var(--primary); font-weight: 500; }
    .threads-list { display: flex; flex-direction: column; gap: 14px; }
    .back-btn { margin-bottom: 16px; }
    .thread-detail-card { margin-bottom: 20px; }
    .thread-detail-header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
    .thread-detail-author { font-weight: 600; font-size: 0.9rem; }
    .thread-detail-time { font-size: 0.78rem; color: var(--gray-400); }
    .thread-detail-title { font-size: 1.2rem; font-weight: 700; margin-bottom: 12px; }
    .thread-detail-content { font-size: 0.9rem; color: var(--gray-600); line-height: 1.8; }
    .replies-heading { font-size: 1rem; font-weight: 600; margin-bottom: 14px; }
    .reply-card { margin-bottom: 12px; }
    .reply-header { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
    .reply-author { font-size: 0.875rem; font-weight: 600; display: flex; align-items: center; gap: 6px; }
    .reply-time { font-size: 0.72rem; color: var(--gray-400); }
    .reply-content { font-size: 0.875rem; color: var(--gray-600); line-height: 1.6; }
    .instructor-tag { background: var(--primary-light); color: var(--primary); font-size: 0.68rem; font-weight: 700; padding: 2px 8px; border-radius: var(--radius-full); }
    .reply-form { margin-top: 16px; }
    .reply-form h4 { font-size: 0.9rem; font-weight: 600; margin-bottom: 10px; }
    .locked-notice { text-align: center; padding: 20px; color: var(--gray-400); font-size: 0.875rem; display: flex; align-items: center; justify-content: center; gap: 8px; }
  `]
})
export class DiscussionsComponent implements OnInit {
  threads: DiscussionThread[] = [];
  replies: Reply[] = [];
  activeThread: DiscussionThread | null = null;
  loading = true;
  showNewThread = false;
  posting = false;
  postingReply = false;
  replyContent = '';
  newThread = { title: '', content: '', courseId: 0 };

  constructor(private discussionService: DiscussionService, private authService: AuthService) {}

  ngOnInit() {
    this.discussionService.getAllThreads().subscribe({
      next: res => { this.threads = res.content || []; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  openThread(t: DiscussionThread) {
    this.activeThread = t;
    this.discussionService.getRepliesByThread(t.id).subscribe({
      next: replies => this.replies = replies,
      error: () => {}
    });
  }

  postThread() {
    if (!this.newThread.title.trim() || !this.newThread.content.trim()) return;
    this.posting = true;
    this.discussionService.createThread({ ...this.newThread }).subscribe({
      next: t => {
        this.threads.unshift(t);
        this.newThread = { title: '', content: '', courseId: 0 };
        this.showNewThread = false;
        this.posting = false;
      },
      error: () => { this.posting = false; }
    });
  }

  postReply() {
    if (!this.activeThread || !this.replyContent.trim()) return;
    this.postingReply = true;
    this.discussionService.addReply(this.activeThread.id, { content: this.replyContent }).subscribe({
      next: r => {
        this.replies.push(r);
        this.replyContent = '';
        this.postingReply = false;
      },
      error: () => { this.postingReply = false; }
    });
  }
}
