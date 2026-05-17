import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CourseCardComponent } from '../../../shared/components/course-card/course-card.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { CourseService } from '../../../core/services/course.service';
import { Course, CourseFilter } from '../../../core/models';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, FormsModule, CourseCardComponent, LoadingSpinnerComponent, EmptyStateComponent],
  template: `
    <div class="courses-page">
      <div class="courses-page-header">
        <div class="header-container">
          <h1>Course Catalog</h1>
          <p>Discover {{ totalElements }} courses across all subjects</p>
        </div>
      </div>

      <div class="courses-layout">
        <!-- Filters Sidebar -->
        <aside class="filters-panel">
          <div class="filter-section">
            <h4 class="filter-heading">Search</h4>
            <div class="search-box">
              <i class="fas fa-search search-icon"></i>
              <input type="text" [(ngModel)]="filter.search" placeholder="Search courses..."
                     class="form-control search-input" (input)="onFilterChange()">
            </div>
          </div>

          <div class="filter-section">
            <h4 class="filter-heading">Category</h4>
            <div class="filter-options">
              <label class="filter-option" *ngFor="let cat of categories">
                <input type="radio" name="category" [value]="cat"
                       [(ngModel)]="filter.category" (change)="onFilterChange()">
                <span>{{ cat }}</span>
              </label>
              <label class="filter-option">
                <input type="radio" name="category" [value]="''"
                       [(ngModel)]="filter.category" (change)="onFilterChange()">
                <span>All Categories</span>
              </label>
            </div>
          </div>

          <div class="filter-section">
            <h4 class="filter-heading">Level</h4>
            <div class="filter-options">
              <label class="filter-option" *ngFor="let level of levels">
                <input type="radio" name="level" [value]="level.value"
                       [(ngModel)]="filter.level" (change)="onFilterChange()">
                <span>{{ level.label }}</span>
              </label>
            </div>
          </div>

          <div class="filter-section">
            <h4 class="filter-heading">Price</h4>
            <div class="filter-options">
              <label class="filter-option">
                <input type="radio" name="price" [value]="undefined"
                       [(ngModel)]="filter.isFree" (change)="onFilterChange()">
                <span>All Prices</span>
              </label>
              <label class="filter-option">
                <input type="radio" name="price" [value]="true"
                       [(ngModel)]="filter.isFree" (change)="onFilterChange()">
                <span>Free</span>
              </label>
              <label class="filter-option">
                <input type="radio" name="price" [value]="false"
                       [(ngModel)]="filter.isFree" (change)="onFilterChange()">
                <span>Paid</span>
              </label>
            </div>
          </div>

          <button class="btn btn-secondary btn-sm" (click)="clearFilters()">
            <i class="fas fa-times"></i> Clear Filters
          </button>
        </aside>

        <!-- Courses List -->
        <div class="courses-main">
          <div class="courses-toolbar">
            <p class="results-count">
              Showing <strong>{{ courses.length }}</strong> of <strong>{{ totalElements }}</strong> courses
            </p>
            <select class="form-control form-select" style="width:auto" [(ngModel)]="sortBy" (change)="onFilterChange()">
              <option value="newest">Newest First</option>
              <option value="popular">Most Popular</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>

          <app-loading-spinner *ngIf="loading" />

          <div class="courses-grid" *ngIf="!loading && courses.length > 0">
            <app-course-card *ngFor="let c of courses" [course]="c" />
          </div>

          <app-empty-state *ngIf="!loading && courses.length === 0"
            icon="fa-search"
            title="No courses found"
            message="Try adjusting your search or filter criteria to find what you're looking for." />

          <!-- Pagination -->
          <div class="pagination" *ngIf="totalPages > 1">
            <button class="page-btn" [disabled]="page === 0" (click)="changePage(page - 1)">
              <i class="fas fa-chevron-left"></i>
            </button>
            <button *ngFor="let p of pageNumbers" class="page-btn"
                    [class.active]="p === page" (click)="changePage(p)">
              {{ p + 1 }}
            </button>
            <button class="page-btn" [disabled]="page === totalPages - 1" (click)="changePage(page + 1)">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .courses-page-header {
      background: linear-gradient(135deg, var(--primary-subtle), var(--white));
      padding: 48px 0 32px; border-bottom: 1px solid var(--gray-200);
    }
    .header-container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
    .header-container h1 { font-size: 2rem; font-weight: 700; color: var(--gray-900); }
    .header-container p { color: var(--gray-500); margin-top: 4px; }
    .courses-layout {
      max-width: 1200px; margin: 0 auto; padding: 32px 24px;
      display: grid; grid-template-columns: 260px 1fr; gap: 32px;
    }
    .filters-panel {
      height: fit-content; position: sticky; top: 80px;
    }
    .filter-section {
      background: var(--white); border: 1px solid var(--gray-200);
      border-radius: var(--radius-lg); padding: 20px; margin-bottom: 16px;
    }
    .filter-heading {
      font-size: 0.82rem; font-weight: 700; letter-spacing: 0.06em;
      text-transform: uppercase; color: var(--gray-500); margin-bottom: 12px;
    }
    .search-box { position: relative; }
    .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--gray-400); }
    .search-input { padding-left: 36px; }
    .filter-options { display: flex; flex-direction: column; gap: 8px; }
    .filter-option {
      display: flex; align-items: center; gap: 8px;
      font-size: 0.875rem; color: var(--gray-700); cursor: pointer;
    }
    .filter-option input { accent-color: var(--primary); }
    .courses-toolbar {
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: 20px;
    }
    .results-count { font-size: 0.875rem; color: var(--gray-500); }
    .courses-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
    .pagination {
      display: flex; justify-content: center; gap: 6px; margin-top: 32px; flex-wrap: wrap;
    }
    .page-btn {
      width: 36px; height: 36px; border: 1.5px solid var(--gray-200);
      border-radius: var(--radius); background: var(--white);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; font-size: 0.875rem; color: var(--gray-600);
      transition: var(--transition);
    }
    .page-btn:hover:not(:disabled) { border-color: var(--primary); color: var(--primary); }
    .page-btn.active { background: var(--primary); border-color: var(--primary); color: #fff; }
    .page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
    @media (max-width: 900px) {
      .courses-layout { grid-template-columns: 1fr; }
      .filters-panel { position: static; }
      .courses-grid { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 540px) {
      .courses-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class CoursesComponent implements OnInit {
  courses: Course[] = [];
  loading = false;
  page = 0;
  totalPages = 0;
  totalElements = 0;
  sortBy = 'newest';

  filter: CourseFilter = { page: 0, size: 12 };

  categories = ['Development', 'Business', 'Design', 'Data Science', 'Cloud & DevOps', 'Security', 'Marketing'];
  levels = [
    { label: 'All Levels', value: '' },
    { label: 'Beginner',   value: 'BEGINNER' },
    { label: 'Intermediate', value: 'INTERMEDIATE' },
    { label: 'Advanced',   value: 'ADVANCED' }
  ];

  constructor(private courseService: CourseService) {}

  ngOnInit() { this.loadCourses(); }

  loadCourses() {
    this.loading = true;
    this.filter.page = this.page;
    this.courseService.getAllCourses(this.filter).subscribe({
      next: res => {
        this.courses = res.content || [];
        this.totalPages = res.totalPages || 0;
        this.totalElements = res.totalElements || 0;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  onFilterChange() { this.page = 0; this.loadCourses(); }
  changePage(p: number) { this.page = p; this.loadCourses(); }
  clearFilters() { this.filter = { page: 0, size: 12 }; this.page = 0; this.loadCourses(); }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }
}
