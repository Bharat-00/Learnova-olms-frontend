import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Payment, Subscription, ApiResponse, PagedResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private readonly BASE = `${environment.apiBaseUrl}/api/v1/payments`;

  constructor(private http: HttpClient) {}

  initiateCoursePayment(courseId: number): Observable<Payment> {
    return this.http.post<Payment>(`${this.BASE}/courses/${courseId}`, {});
  }

  markPaymentSuccess(paymentId: number): Observable<Payment> {
    return this.http.post<Payment>(`${this.BASE}/${paymentId}/success`, {});
  }

  getMyPayments(): Observable<Payment[]> {
    return this.http.get<Payment[]>(this.BASE);
  }

  getAllPayments(page = 0, size = 20): Observable<PagedResponse<Payment>> {
    return this.http.get<PagedResponse<Payment>>(`${this.BASE}?page=${page}&size=${size}`);
  }

  getPaymentById(id: number): Observable<Payment> {
    return this.http.get<Payment>(`${this.BASE}/${id}`);
  }

  getMySubscription(): Observable<Subscription> {
    return this.http.get<Subscription>(`${this.BASE}/subscription/my`);
  }

  getAllSubscriptions(page = 0, size = 20): Observable<PagedResponse<Subscription>> {
    return this.http.get<PagedResponse<Subscription>>(`${this.BASE}/subscriptions?page=${page}&size=${size}`);
  }

  subscribeToPlan(plan: string): Observable<Subscription> {
    return this.http.post<Subscription>(`${this.BASE}/subscription`, { plan });
  }

  cancelSubscription(): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.BASE}/subscription/cancel`, {});
  }

  getPaymentStats(): Observable<any> {
    return this.http.get<any>(`${this.BASE}/stats`);
  }
}
