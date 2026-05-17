import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Notification, ApiResponse, PagedResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly BASE = `${environment.apiBaseUrl}/api/v1/notifications`;
  private unreadCount = new BehaviorSubject<number>(0);
  unreadCount$ = this.unreadCount.asObservable();

  constructor(private http: HttpClient) {}

  getMyNotifications(page = 0, size = 20): Observable<PagedResponse<Notification>> {
    return this.http.get<PagedResponse<Notification>>(`${this.BASE}/my?page=${page}&size=${size}`);
  }

  getUnreadCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.BASE}/unread-count`).pipe(
      tap(res => this.unreadCount.next(res.count))
    );
  }

  markAsRead(id: number): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.BASE}/${id}/read`, {}).pipe(
      tap(() => {
        const current = this.unreadCount.value;
        if (current > 0) this.unreadCount.next(current - 1);
      })
    );
  }

  markAllAsRead(): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.BASE}/read-all`, {}).pipe(
      tap(() => this.unreadCount.next(0))
    );
  }

  deleteNotification(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.BASE}/${id}`);
  }

  sendBulkNotification(payload: { title: string; message: string; type: string; targetRole?: string }): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.BASE}/bulk`, payload);
  }

  getAllNotifications(page = 0, size = 20): Observable<PagedResponse<Notification>> {
    return this.http.get<PagedResponse<Notification>>(`${this.BASE}?page=${page}&size=${size}`);
  }
}
