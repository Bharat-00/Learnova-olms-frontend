import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Course, CourseFilter, PagedResponse, ApiResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class CourseService {
  private readonly BASE = `${environment.apiBaseUrl}/api/v1/courses`;

  constructor(private http: HttpClient) {}

  getAllCourses(filter?: CourseFilter): Observable<PagedResponse<Course>> {
    let params = new HttpParams();

    if (filter) {
      if (filter.search) params = params.set('search', filter.search);
      if (filter.category) params = params.set('category', filter.category);
      if (filter.level) params = params.set('level', filter.level);
      if (filter.language) params = params.set('language', filter.language);
      if (filter.isFree !== undefined) params = params.set('isFree', String(filter.isFree));

      params = params.set('page', String(filter.page ?? 0));
      params = params.set('size', String(filter.size ?? 12));
    }

    return this.http.get<PagedResponse<Course>>(this.BASE, { params });
  }

  getPublishedCourses(filter?: CourseFilter): Observable<PagedResponse<Course>> {
    return this.getAllCourses({ ...filter });
  }

  getCourseById(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.BASE}/${id}`);
  }

  createCourse(course: Partial<Course>): Observable<Course> {
    return this.http.post<Course>(this.BASE, course);
  }

  updateCourse(id: number, course: Partial<Course>): Observable<Course> {
    return this.http.put<Course>(`${this.BASE}/${id}`, course);
  }

  deleteCourse(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.BASE}/${id}`);
  }

  publishCourse(id: number): Observable<Course> {
    return this.http.put<Course>(`${this.BASE}/${id}/publish`, {});
  }

  unpublishCourse(id: number): Observable<Course> {
    return this.http.put<Course>(`${this.BASE}/${id}/unpublish`, {});
  }

  approveCourse(id: number): Observable<Course> {
    return this.http.put<Course>(`${this.BASE}/${id}/approve`, {});
  }

  rejectCourse(id: number, reason: string): Observable<Course> {
    return this.http.put<Course>(`${this.BASE}/${id}/reject`, { reason });
  }

  getCoursesByInstructor(instructorId: number): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.BASE}/instructor/${instructorId}`);
  }

  getFeaturedCourses(): Observable<Course[]> {
    return new Observable<Course[]>(observer => {
      this.getAllCourses({ page: 0, size: 4 }).subscribe({
        next: response => {
          const courses = Array.isArray(response)
            ? response
            : response.content || [];

          observer.next(courses);
          observer.complete();
        },
        error: error => observer.error(error)
      });
    });
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.BASE}/categories`);
  }
}