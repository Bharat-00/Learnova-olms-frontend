import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Certificate, PagedResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class CertificateService {
  private readonly BASE = `${environment.apiBaseUrl}/api/v1/certificates`;

  constructor(private http: HttpClient) {}

  getMyCertificates(): Observable<Certificate[]> {
    return this.http.get<Certificate[]>(this.BASE);
  }

  getAllCertificates(page = 0, size = 20): Observable<PagedResponse<Certificate>> {
    return this.http.get<PagedResponse<Certificate>>(`${this.BASE}?page=${page}&size=${size}`);
  }

  getCertificateById(id: number): Observable<Certificate> {
    return this.http.get<Certificate>(`${this.BASE}/${id}`);
  }

  verifyCertificate(code: string): Observable<Certificate> {
    return this.http.get<Certificate>(`${this.BASE}/verify/${code}`);
  }

  downloadCertificate(id: number): Observable<Blob> {
    return this.http.get(`${this.BASE}/download/${id}`, { responseType: 'blob' });
  }

  issueCertificate(userId: number, courseId: number): Observable<Certificate> {
    return this.http.post<Certificate>(`${this.BASE}/generate`, { userId, courseId });
  }
}
