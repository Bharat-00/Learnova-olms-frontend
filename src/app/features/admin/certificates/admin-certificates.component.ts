import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { CertificateService } from '../../../core/services/certificate.service';
import { Certificate } from '../../../core/models';

@Component({
  selector: 'app-admin-certificates',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent, EmptyStateComponent],
  template: `
    <div class="fade-in">
      <div class="page-header"><div><h1 class="page-title">Certificates</h1><p class="page-subtitle">All issued certificates on the platform</p></div></div>
      <app-loading-spinner *ngIf="loading" />
      <div class="table-container" *ngIf="!loading && certs.length > 0">
        <table>
          <thead><tr><th>ID</th><th>Student</th><th>Course</th><th>Instructor</th><th>Verification Code</th><th>Issued</th></tr></thead>
          <tbody>
            <tr *ngFor="let c of certs">
              <td class="text-muted">#{{ c.id }}</td>
              <td>{{ c.studentName || '#' + c.userId }}</td>
              <td>{{ c.courseTitle || 'Course #' + c.courseId }}</td>
              <td>{{ c.instructorName || '—' }}</td>
              <td><code class="cert-code">{{ c.verificationCode || 'LRN-' + c.id }}</code></td>
              <td class="text-sm text-muted">{{ c.issuedAt | date:'mediumDate' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <app-empty-state *ngIf="!loading && certs.length === 0" icon="fa-certificate" title="No certificates" message="Certificates are issued when students complete courses." />
    </div>
  `,
  styles: [`.cert-code { font-size: 0.78rem; font-weight: 700; color: var(--primary); background: var(--primary-light); padding: 2px 8px; border-radius: 4px; }`]
})
export class AdminCertificatesComponent implements OnInit {
  certs: Certificate[] = [];
  loading = true;
  constructor(private certService: CertificateService) {}
  ngOnInit() {
    this.certService.getAllCertificates(0, 50).subscribe({ next: r => { this.certs = r.content || []; this.loading = false; }, error: () => { this.loading = false; } });
  }
}
