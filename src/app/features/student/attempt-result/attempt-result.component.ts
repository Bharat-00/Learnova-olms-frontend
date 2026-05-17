import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { AssesmentService } from '../../../core/services/assesment.service';
import { Attempt } from '../../../core/models';

@Component({
  selector: 'app-attempt-result',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingSpinnerComponent],
  template: `
    <div class="fade-in">
      <app-loading-spinner *ngIf="loading" />

      <div class="result-page" *ngIf="!loading && attempt">
        <div class="result-card card">
          <!-- Result Header -->
          <div class="result-header" [class.passed]="attempt.passed" [class.failed]="!attempt.passed">
            <div class="result-icon">
              <i class="fas" [class.fa-trophy]="attempt.passed" [class.fa-times-circle]="!attempt.passed"></i>
            </div>
            <h1 class="result-title">{{ attempt.passed ? 'Congratulations!' : 'Keep Trying!' }}</h1>
            <p class="result-subtitle">
              {{ attempt.passed ? 'You passed the assesment successfully.' : 'You did not reach the passing score. Review and try again.' }}
            </p>
          </div>

          <!-- Score Display -->
          <div class="score-display">
            <div class="score-circle" [class.passed]="attempt.passed" [class.failed]="!attempt.passed">
              <div class="score-num">{{ attempt.percentage }}%</div>
              <div class="score-label">Your Score</div>
            </div>
          </div>

          <!-- Stats Grid -->
          <div class="result-stats">
            <div class="result-stat">
              <div class="rs-icon passed-bg"><i class="fas fa-check-circle"></i></div>
              <div class="rs-val">{{ attempt.score }}</div>
              <div class="rs-lbl">Points Earned</div>
            </div>
            <div class="result-stat">
              <div class="rs-icon info-bg"><i class="fas fa-star"></i></div>
              <div class="rs-val">{{ attempt.totalPoints }}</div>
              <div class="rs-lbl">Total Points</div>
            </div>
            <div class="result-stat">
              <div class="rs-icon primary-bg"><i class="fas fa-percentage"></i></div>
              <div class="rs-val">{{ attempt.percentage }}%</div>
              <div class="rs-lbl">Score</div>
            </div>
            <div class="result-stat">
              <div class="rs-icon" [ngClass]="attempt.passed ? 'passed-bg' : 'failed-bg'">
                <i class="fas" [class.fa-check]="attempt.passed" [class.fa-times]="!attempt.passed"></i>
              </div>
              <div class="rs-val">{{ attempt.passed ? 'PASSED' : 'FAILED' }}</div>
              <div class="rs-lbl">Result</div>
            </div>
          </div>

          <!-- Time Info -->
          <div class="time-info card" style="background:var(--gray-50)">
            <div class="ti-row">
              <span><i class="fas fa-play"></i> Started</span>
              <strong>{{ attempt.startedAt | date:'medium' }}</strong>
            </div>
            <div class="ti-row">
              <span><i class="fas fa-flag-checkered"></i> Submitted</span>
              <strong>{{ attempt.submittedAt | date:'medium' }}</strong>
            </div>
          </div>

          <!-- Answer Review -->
          <div class="answers-section" *ngIf="attempt.answers && attempt.answers.length > 0">
            <h3>Answer Review</h3>
            <div class="answer-item" *ngFor="let a of attempt.answers; let i = index"
                 [class.correct]="a.isCorrect" [class.incorrect]="!a.isCorrect">
              <div class="ai-header">
                <div class="ai-num">Q{{ i + 1 }}</div>
                <div class="ai-status">
                  <i class="fas" [class.fa-check-circle]="a.isCorrect" [class.fa-times-circle]="!a.isCorrect"></i>
                  <span>{{ a.isCorrect ? 'Correct' : 'Incorrect' }}</span>
                </div>
                <div class="ai-points">+{{ a.points }} pts</div>
              </div>
              <div class="ai-answer">Your answer: <strong>{{ a.selectedAnswer }}</strong></div>
            </div>
          </div>

          <!-- Actions -->
          <div class="result-actions">
            <a routerLink="/student/courses" class="btn btn-secondary">
              <i class="fas fa-book-open"></i> Back to Courses
            </a>
            <button class="btn btn-outline" *ngIf="!attempt.passed" (click)="retake()">
              <i class="fas fa-redo"></i> Retake Assesment
            </button>
            <a routerLink="/student/certificates" class="btn btn-primary" *ngIf="attempt.passed">
              <i class="fas fa-certificate"></i> View Certificate
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .result-page { max-width: 700px; margin: 0 auto; }
    .result-card { padding: 0; overflow: hidden; }
    .result-header { padding: 40px 32px; text-align: center; }
    .result-header.passed { background: linear-gradient(135deg, #059669, #10b981); }
    .result-header.failed { background: linear-gradient(135deg, #dc2626, #ef4444); }
    .result-icon { width: 72px; height: 72px; border-radius: 50%; background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; font-size: 2rem; color: #fff; margin: 0 auto 16px; }
    .result-title { font-size: 1.8rem; font-weight: 800; color: #fff; margin-bottom: 8px; }
    .result-subtitle { color: rgba(255,255,255,0.85); font-size: 0.95rem; }
    .score-display { display: flex; justify-content: center; padding: 32px; }
    .score-circle { width: 140px; height: 140px; border-radius: 50%; display: flex; flex-direction: column; align-items: center; justify-content: center; border: 6px solid; }
    .score-circle.passed { border-color: var(--success); background: var(--success-light); }
    .score-circle.failed { border-color: var(--danger); background: var(--danger-light); }
    .score-num { font-family: var(--font-display); font-size: 2.2rem; font-weight: 800; line-height: 1; }
    .score-circle.passed .score-num { color: #059669; }
    .score-circle.failed .score-num { color: var(--danger); }
    .score-label { font-size: 0.8rem; color: var(--gray-500); margin-top: 4px; }
    .result-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; padding: 0 32px 24px; }
    .result-stat { text-align: center; }
    .rs-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; margin: 0 auto 8px; }
    .passed-bg { background: var(--success-light); color: var(--success); }
    .failed-bg { background: var(--danger-light); color: var(--danger); }
    .info-bg { background: var(--warning-light); color: var(--warning); }
    .primary-bg { background: var(--primary-light); color: var(--primary); }
    .rs-val { font-family: var(--font-display); font-size: 1.1rem; font-weight: 700; color: var(--gray-800); }
    .rs-lbl { font-size: 0.75rem; color: var(--gray-500); }
    .time-info { margin: 0 32px 24px; padding: 16px; display: flex; flex-direction: column; gap: 10px; }
    .ti-row { display: flex; justify-content: space-between; align-items: center; font-size: 0.875rem; color: var(--gray-600); }
    .ti-row span { display: flex; align-items: center; gap: 8px; }
    .ti-row i { color: var(--gray-400); }
    .answers-section { padding: 0 32px 24px; }
    .answers-section h3 { font-size: 1rem; font-weight: 700; margin-bottom: 16px; }
    .answer-item { border: 1.5px solid var(--gray-200); border-radius: var(--radius); padding: 12px 16px; margin-bottom: 10px; }
    .answer-item.correct { border-color: var(--success); background: var(--success-light); }
    .answer-item.incorrect { border-color: var(--danger); background: var(--danger-light); }
    .ai-header { display: flex; align-items: center; gap: 12px; margin-bottom: 6px; }
    .ai-num { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--gray-500); }
    .ai-status { display: flex; align-items: center; gap: 5px; font-size: 0.825rem; font-weight: 600; flex: 1; }
    .answer-item.correct .ai-status { color: #059669; }
    .answer-item.incorrect .ai-status { color: var(--danger); }
    .ai-points { font-size: 0.75rem; font-weight: 700; color: var(--gray-500); }
    .ai-answer { font-size: 0.85rem; color: var(--gray-700); }
    .result-actions { display: flex; justify-content: center; gap: 12px; padding: 24px 32px; border-top: 1px solid var(--gray-100); flex-wrap: wrap; }
    @media (max-width: 600px) { .result-stats { grid-template-columns: repeat(2, 1fr); } }
  `]
})
export class AttemptResultComponent implements OnInit {
  attempt: Attempt | null = null;
  loading = true;

  constructor(private route: ActivatedRoute, private assesmentService: AssesmentService) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('attemptId'));
    this.assesmentService.getAttemptById(id).subscribe({
      next: a => { this.attempt = a; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  retake() { history.back(); }
}
