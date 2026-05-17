import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DiscussionThread, Reply, ApiResponse, PagedResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class DiscussionService {
  private readonly BASE = `${environment.apiBaseUrl}/api/v1/discussions`;

  constructor(private http: HttpClient) {}

  // ── Threads ──
  getThreadsByCourse(courseId: number, page = 0, size = 20): Observable<PagedResponse<DiscussionThread>> {
    return this.http.get<PagedResponse<DiscussionThread>>(
      `${this.BASE}/course/${courseId}?page=${page}&size=${size}`
    );
  }

  getAllThreads(page = 0, size = 20): Observable<PagedResponse<DiscussionThread>> {
    return this.http.get<PagedResponse<DiscussionThread>>(`${this.BASE}?page=${page}&size=${size}`);
  }

  getThreadById(id: number): Observable<DiscussionThread> {
    return this.http.get<DiscussionThread>(`${this.BASE}/${id}`);
  }

  createThread(thread: Partial<DiscussionThread>): Observable<DiscussionThread> {
    return this.http.post<DiscussionThread>(this.BASE, thread);
  }

  updateThread(id: number, thread: Partial<DiscussionThread>): Observable<DiscussionThread> {
    return this.http.put<DiscussionThread>(`${this.BASE}/${id}`, thread);
  }

  deleteThread(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.BASE}/${id}`);
  }

  pinThread(id: number): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.BASE}/${id}/pin`, {});
  }

  lockThread(id: number): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.BASE}/${id}/lock`, {});
  }

  // ── Replies ──
  getRepliesByThread(threadId: number): Observable<Reply[]> {
    return this.http.get<Reply[]>(`${this.BASE}/${threadId}/replies`);
  }

  addReply(threadId: number, reply: Partial<Reply>): Observable<Reply> {
    return this.http.post<Reply>(`${this.BASE}/${threadId}/replies`, reply);
  }

  deleteReply(threadId: number, replyId: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.BASE}/${threadId}/replies/${replyId}`);
  }
}
