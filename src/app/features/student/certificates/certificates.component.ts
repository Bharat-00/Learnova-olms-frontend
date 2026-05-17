import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { CertificateService } from '../../../core/services/certificate.service';
import { Certificate } from '../../../core/models';

@Component({
  selector: 'app-certificates',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent, EmptyStateComponent],
  template: `
    <div class="fade-in">
      <div class="page-header">
        <div>
          <h1 class="page-title">My Certificates</h1>
          <p class="page-subtitle">Your earned certificates for completed courses</p>
        </div>
      </div>

      <app-loading-spinner *ngIf="loading" />

      <div class="certs-grid" *ngIf="!loading && certificates.length > 0">
        <div class="cert-card card" *ngFor="let cert of certificates">
          <div class="cert-preview">
            <div class="cert-watermark"><i class="fas fa-graduation-cap"></i></div>
            <div class="cert-inner">
              <div class="cert-label">Certificate of Completion</div>
              <div class="cert-course-name">{{ cert.courseTitle || 'Course #' + cert.courseId }}</div>
              <div class="cert-recipient">{{ cert.studentName }}</div>
              <div class="cert-date">Issued {{ cert.issuedAt | date:'longDate' }}</div>
              <div class="cert-instructor" *ngIf="cert.instructorName">
                By {{ cert.instructorName }}
              </div>
            </div>
          </div>
          <div class="cert-footer">
            <div class="cert-code">
              <span class="cert-code-label">Verification Code:</span>
              <code>{{ cert.verificationCode || 'LRN-' + cert.id }}</code>
            </div>
            <div class="cert-actions">
              <button class="btn btn-outline btn-sm" (click)="download(cert)">
                <i class="fas fa-download"></i> Download
              </button>
              <button class="btn btn-secondary btn-sm" (click)="share(cert)">
                <i class="fas fa-share-alt"></i> Share
              </button>
            </div>
          </div>
        </div>
      </div>

      <app-empty-state *ngIf="!loading && certificates.length === 0"
        icon="fa-certificate"
        title="No certificates yet"
        message="Complete a course to earn your first certificate. Keep learning and keep growing!"
        actionLabel="Browse Courses"
        (action)="goToCatalog()" />
    </div>
  `,
  styles: [`
    .certs-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(380px, 1fr)); gap: 24px; }
    .cert-card { padding: 0; overflow: hidden; }
    .cert-preview {
      background: linear-gradient(135deg, #1a1a2e, #16213e, #0f3460);
      padding: 40px 32px; position: relative; overflow: hidden; min-height: 200px;
      display: flex; align-items: center; justify-content: center;
    }
    .cert-watermark { position: absolute; right: -20px; bottom: -20px; font-size: 8rem; color: rgba(255,255,255,0.04); }
    .cert-inner { text-align: center; position: relative; z-index: 2; }
    .cert-label { font-size: 0.72rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #f59e0b; margin-bottom: 12px; }
    .cert-course-name { font-family: var(--font-display); font-size: 1.3rem; font-weight: 700; color: #fff; margin-bottom: 10px; line-height: 1.3; }
    .cert-recipient { font-size: 0.9rem; color: rgba(255,255,255,0.7); margin-bottom: 8px; }
    .cert-date { font-size: 0.78rem; color: rgba(255,255,255,0.5); }
    .cert-instructor { font-size: 0.78rem; color: rgba(255,255,255,0.5); margin-top: 4px; }
    .cert-footer { padding: 16px 20px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
    .cert-code { display: flex; flex-direction: column; gap: 2px; }
    .cert-code-label { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--gray-400); }
    .cert-code code { font-size: 0.8rem; font-weight: 700; color: var(--primary); background: var(--primary-light); padding: 2px 8px; border-radius: 4px; }
    .cert-actions { display: flex; gap: 8px; }
  `]
})
export class CertificatesComponent implements OnInit {
  certificates: Certificate[] = [];
  loading = true;

  constructor(private certService: CertificateService) {}

  ngOnInit() {
    this.certService.getMyCertificates().subscribe({
      next: data => { this.certificates = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  download(cert: Certificate) {
    this.certService.downloadCertificate(cert.id).subscribe({
      next: blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = `certificate-${cert.id}.pdf`; a.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => alert('Download failed. Please try again.')
    });
  }

  share(cert: Certificate) {
    const text = `I just earned a certificate for "${cert.courseTitle}" on Learnova! Verification: ${cert.verificationCode || 'LRN-' + cert.id}`;
    if (navigator.share) {
      navigator.share({ title: 'My Learnova Certificate', text });
    } else {
      navigator.clipboard.writeText(text).then(() => alert('Certificate link copied!'));
    }
  }

  goToCatalog() { window.location.href = '/courses'; }
}
