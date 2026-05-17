import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Progress, CourseProgress } from '../models';

@Injectable({ providedIn: 'root' })
export class ProgressService {
  private readonly BASE = `${environment.apiBaseUrl}/api/v1/progress`;

  constructor(private http: HttpClient) {}

  markLessonComplete(lessonId: number, courseId: number): Observable<Progress> {
    return this.http.post<Progress>(`${this.BASE}/courses/${courseId}/lessons/${lessonId}/complete`, {});
  }

  getProgressByLesson(lessonId: number): Observable<Progress> {
    return this.http.get<Progress>(`${this.BASE}/lessons/${lessonId}`);
  }

  getProgressByCourse(courseId: number): Observable<CourseProgress> {
    return this.http.get<CourseProgress>(`${this.BASE}/courses/${courseId}`);
  }

  getAllMyProgress(): Observable<CourseProgress[]> {
    return this.http.get<CourseProgress[]>(this.BASE);
  }

  getStudentProgress(userId: number, courseId: number): Observable<CourseProgress> {
    return this.http.get<CourseProgress>(`${this.BASE}/user/${userId}/course/${courseId}`);
  }

  getLessonCompletionStatus(courseId: number): Observable<{ lessonId: number; completed: boolean }[]> {
    return this.http.get<{ lessonId: number; completed: boolean }[]>(`${this.BASE}/courses/${courseId}/lessons`);
  }
}
