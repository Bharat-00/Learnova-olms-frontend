import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, BehaviorSubject, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, RegisterRequest, AuthResponse, User } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly BASE = `${environment.apiBaseUrl}/api/v1/auth`;
  private readonly TOKEN_KEY = 'learnova_token';
  private readonly USER_KEY = 'learnova_user';

  private currentUserSubject = new BehaviorSubject<User | null>(this.loadUser());
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  login(req: LoginRequest): Observable<AuthResponse> {
    return this.http.post<any>(`${this.BASE}/login`, req).pipe(
      map(res => this.normalizeAuthResponse(res, req.email)),
      tap(res => this.storeSession(res))
    );
  }

  register(req: RegisterRequest): Observable<AuthResponse> {
    const payload = {
      name: `${req.firstName || ''} ${req.lastName || ''}`.trim(),
      firstName: req.firstName,
      lastName: req.lastName,
      email: req.email,
      password: req.password,
      role: req.role || 'STUDENT'
    };

    return this.http.post<any>(`${this.BASE}/register`, payload).pipe(
      map(res => this.normalizeAuthResponse(res, req.email, req.firstName, req.lastName, req.role || 'STUDENT')),
      tap(res => this.storeSession(res))
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    try {
      const payload = this.decodeToken(token);
      return !payload.exp || payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  getRole(): string {
    const user = this.currentUserSubject.value;
    if (user?.role) return user.role;

    const token = this.getToken();
    if (!token) return '';

    try {
      const payload = this.decodeToken(token);
      const role = payload.role || payload.roles?.[0] || payload.authorities?.[0]?.authority || '';
      return String(role).replace('ROLE_', '');
    } catch {
      return '';
    }
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isStudent(): boolean { return this.getRole() === 'STUDENT'; }
  isInstructor(): boolean { return this.getRole() === 'INSTRUCTOR'; }
  isAdmin(): boolean { return this.getRole() === 'ADMIN'; }

  getDashboardRoute(): string {
    const role = this.getRole();
    if (role === 'ADMIN') return '/admin/dashboard';
    if (role === 'INSTRUCTOR') return '/instructor/dashboard';
    return '/student/dashboard';
  }

  private storeSession(res: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, res.token);

    const user: User = {
      id: res.id || 1,
      firstName: res.firstName || 'Bharat',
      lastName: res.lastName || 'Trivedi',
      email: res.email,
      role: (res.role || 'STUDENT') as User['role'],
    };

    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  private normalizeAuthResponse(
    res: any,
    fallbackEmail: string,
    fallbackFirstName = 'Bharat',
    fallbackLastName = 'Trivedi',
    fallbackRole = 'STUDENT'
  ): AuthResponse {
    const token = res?.token || res?.accessToken || res?.jwt || res?.data?.token || res?.data?.accessToken || '';
    const decoded = token ? this.safeDecodeToken(token) : {};
    const email = res?.email || res?.data?.email || decoded?.sub || decoded?.email || fallbackEmail;
    const roleRaw = res?.role || res?.data?.role || decoded?.role || decoded?.roles?.[0] || decoded?.authorities?.[0]?.authority || fallbackRole;
    const role = String(roleRaw || fallbackRole).replace('ROLE_', '') || 'STUDENT';

    const fullName = res?.name || res?.data?.name || decoded?.name || '';
    const [firstFromName, ...lastParts] = fullName.split(' ').filter(Boolean);

    return {
      token,
      type: res?.type || 'Bearer',
      id: Number(res?.id || res?.data?.id || decoded?.id || decoded?.userId || 1),
      email,
      firstName: res?.firstName || res?.data?.firstName || decoded?.firstName || firstFromName || fallbackFirstName,
      lastName: res?.lastName || res?.data?.lastName || decoded?.lastName || lastParts.join(' ') || fallbackLastName,
      role
    };
  }

  private loadUser(): User | null {
    try {
      const raw = localStorage.getItem(this.USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  private decodeToken(token: string): any {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = atob(base64);
    return JSON.parse(json);
  }

  private safeDecodeToken(token: string): any {
    try {
      return this.decodeToken(token);
    } catch {
      return {};
    }
  }
}
