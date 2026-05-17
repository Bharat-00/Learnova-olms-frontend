import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Enrollment, ApiResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class EnrollmentService {
  private readonly BASE = `${environment.apiBaseUrl}/api/v1/enrollments`;

  constructor(private http: HttpClient) {}

  enrollInCourse(courseId: number): Observable<Enrollment> {
    return this.http.post<Enrollment>(`${this.BASE}/courses/${courseId}`, {});
  }

  getMyEnrollments(): Observable<Enrollment[]> {
    return this.http.get<Enrollment[]>(`${this.BASE}/me`);
  }

  getEnrollmentsByUser(userId: number): Observable<Enrollment[]> {
    return this.http.get<Enrollment[]>(`${this.BASE}/users/${userId}`);
  }

  getEnrollmentsByCourse(courseId: number): Observable<Enrollment[]> {
    return this.http.get<Enrollment[]>(`${this.BASE}/courses/${courseId}`);
  }

  isEnrolled(courseId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.BASE}/check/courses/${courseId}`);
  }

  cancelEnrollment(courseId: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.BASE}/courses/${courseId}`);
  }

  getEnrollmentById(id: number): Observable<Enrollment> {
    return this.http.get<Enrollment>(`${this.BASE}/${id}`);
  }
}
