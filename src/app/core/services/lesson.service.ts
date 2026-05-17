import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Lesson, ApiResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class LessonService {
  private readonly BASE = `${environment.apiBaseUrl}/api/v1/lessons`;

  constructor(private http: HttpClient) {}

  getLessonsByCourse(courseId: number): Observable<Lesson[]> {
    return this.http.get<Lesson[]>(`${this.BASE}/course/${courseId}`);
  }

  getLessonById(id: number): Observable<Lesson> {
    return this.http.get<Lesson>(`${this.BASE}/${id}`);
  }

  createLesson(lesson: Partial<Lesson>): Observable<Lesson> {
    return this.http.post<Lesson>(this.BASE, lesson);
  }

  updateLesson(id: number, lesson: Partial<Lesson>): Observable<Lesson> {
    return this.http.put<Lesson>(`${this.BASE}/${id}`, lesson);
  }

  deleteLesson(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.BASE}/${id}`);
  }

  reorderLessons(courseId: number, orderedIds: number[]): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.BASE}/reorder/${courseId}`, { orderedIds });
  }
}
