import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Course } from '../../../core/models';

@Component({
  selector: 'app-course-card',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <div class="course-card card card-hover">
      <div class="course-thumb">
        <img *ngIf="course.thumbnailUrl; else placeholder"
             [src]="course.thumbnailUrl" [alt]="course.title" loading="lazy">
        <ng-template #placeholder>
          <div class="thumb-placeholder">
            <i class="fas fa-play-circle"></i>
          </div>
        </ng-template>
        <span class="course-level badge" [ngClass]="levelClass">{{ course.level }}</span>
        <span class="course-price-badge" [class.free]="course.isFree">
          {{ course.isFree ? 'FREE' : ('$' + course.price) }}
        </span>
      </div>
      <div class="course-body">
        <div class="course-category">{{ course.category }}</div>
        <h3 class="course-title">{{ course.title }}</h3>
        <p class="course-desc">{{ course.shortDescription || (course.description | slice:0:80) }}...</p>
        <div class="course-meta">
          <span *ngIf="course.instructorName">
            <i class="fas fa-user-tie"></i> {{ course.instructorName }}
          </span>
          <span *ngIf="course.totalLessons">
            <i class="fas fa-play-circle"></i> {{ course.totalLessons }} lessons
          </span>
          <span *ngIf="course.duration">
            <i class="fas fa-clock"></i> {{ course.duration }}h
          </span>
        </div>
        <div class="course-footer">
          <div class="course-rating" *ngIf="course.rating">
            <i class="fas fa-star"></i>
            <span>{{ course.rating | number:'1.1-1' }}</span>
          </div>
          <a [routerLink]="['/courses', course.id]" class="btn btn-primary btn-sm">View Course</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .course-card { padding: 0; overflow: hidden; display: flex; flex-direction: column; height: 100%; }
    .course-thumb {
      position: relative; height: 180px; overflow: hidden;
      background: linear-gradient(135deg, var(--primary-light), var(--gray-100));
    }
    .course-thumb img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
    .course-card:hover .course-thumb img { transform: scale(1.04); }
    .thumb-placeholder {
      width: 100%; height: 100%;
      display: flex; align-items: center; justify-content: center;
      font-size: 2.5rem; color: var(--primary);
    }
    .course-level {
      position: absolute; top: 12px; left: 12px; z-index: 2;
    }
    .course-price-badge {
      position: absolute; top: 12px; right: 12px;
      background: var(--gray-900); color: #fff;
      font-size: 0.75rem; font-weight: 700;
      padding: 3px 10px; border-radius: var(--radius-full);
    }
    .course-price-badge.free { background: var(--success); }
    .course-body { padding: 18px; flex: 1; display: flex; flex-direction: column; gap: 8px; }
    .course-category {
      font-size: 0.72rem; font-weight: 700; letter-spacing: 0.06em;
      text-transform: uppercase; color: var(--primary);
    }
    .course-title {
      font-size: 1rem; font-weight: 600; line-height: 1.35;
      color: var(--gray-900); display: -webkit-box;
      -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
    }
    .course-desc {
      font-size: 0.82rem; color: var(--gray-500); line-height: 1.5;
      display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
    }
    .course-meta {
      display: flex; flex-wrap: wrap; gap: 12px;
      font-size: 0.78rem; color: var(--gray-500);
    }
    .course-meta span { display: flex; align-items: center; gap: 4px; }
    .course-meta i { color: var(--gray-400); font-size: 0.75rem; }
    .course-footer {
      display: flex; align-items: center; justify-content: space-between;
      margin-top: auto; padding-top: 12px;
      border-top: 1px solid var(--gray-100);
    }
    .course-rating {
      display: flex; align-items: center; gap: 4px;
      font-size: 0.825rem; font-weight: 600; color: var(--warning);
    }
    .badge-primary  { background: var(--primary-light); color: var(--primary); }
    .badge-success  { background: var(--success-light); color: #059669; }
    .badge-warning  { background: var(--warning-light); color: #d97706; }
  `]
})
export class CourseCardComponent {
  @Input() course!: Course;

  get levelClass(): string {
    const map: Record<string, string> = {
      BEGINNER: 'badge-success',
      INTERMEDIATE: 'badge-warning',
      ADVANCED: 'badge-danger'
    };
    return map[this.course.level] || 'badge-gray';
  }
}
