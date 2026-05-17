import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User, PagedResponse, ApiResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly BASE = `${environment.apiBaseUrl}/api/v1/users`;

  constructor(private http: HttpClient) {}

  getAllUsers(page = 0, size = 20): Observable<PagedResponse<User>> {
    return this.http.get<PagedResponse<User>>(`${this.BASE}?page=${page}&size=${size}`);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.BASE}/${id}`);
  }

  updateProfile(id: number, data: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.BASE}/${id}`, data);
  }

  updatePassword(id: number, payload: { currentPassword: string; newPassword: string }): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.BASE}/${id}/password`, payload);
  }

  suspendUser(id: number): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.BASE}/${id}/suspend`, {});
  }

  activateUser(id: number): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.BASE}/${id}/activate`, {});
  }

  deleteUser(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.BASE}/${id}`);
  }

  getUsersByRole(role: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.BASE}/role/${role}`);
  }

  searchUsers(query: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.BASE}/search?q=${query}`);
  }

  getPlatformStats(): Observable<any> {
    return this.http.get<any>(`${this.BASE}/stats`);
  }
}
