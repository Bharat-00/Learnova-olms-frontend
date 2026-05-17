import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <div class="about-page">
      <!-- Hero -->
      <section class="about-hero">
        <div class="about-container">
          <h1>About Learnova</h1>
          <p>We're on a mission to make quality education accessible to everyone, everywhere.</p>
        </div>
      </section>

      <!-- Mission -->
      <section class="section">
        <div class="about-container">
          <div class="mission-grid">
            <div class="mission-content">
              <div class="section-eyebrow">Our Mission</div>
              <h2>Empowering learners to build the skills that matter</h2>
              <p>Learnova was built on the belief that world-class education should be accessible to everyone, not just those who can afford expensive degrees or live near top universities.</p>
              <p>We bring together the world's best instructors, cutting-edge course delivery, and a supportive learning community to help you achieve your goals — on your schedule.</p>
              <a routerLink="/courses" class="btn btn-primary">Start Learning <i class="fas fa-arrow-right"></i></a>
            </div>
            <div class="mission-stats">
              <div class="mission-stat" *ngFor="let s of missionStats">
                <div class="ms-value">{{ s.value }}</div>
                <div class="ms-label">{{ s.label }}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Values -->
      <section class="section section-gray">
        <div class="about-container">
          <div class="section-head-center">
            <h2 class="section-title">Our Core Values</h2>
            <p class="section-subtitle">Principles that guide everything we build and teach</p>
          </div>
          <div class="values-grid">
            <div class="value-card" *ngFor="let v of values">
              <div class="value-icon"><i class="fas {{ v.icon }}"></i></div>
              <h3>{{ v.title }}</h3>
              <p>{{ v.desc }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Team -->
      <section class="section">
        <div class="about-container">
          <div class="section-head-center">
            <h2 class="section-title">Built with Modern Technology</h2>
            <p class="section-subtitle">Learnova is powered by a robust microservices architecture</p>
          </div>
          <div class="tech-grid">
            <div class="tech-item" *ngFor="let t of techStack">
              <div class="tech-icon"><i class="fas {{ t.icon }}"></i></div>
              <div class="tech-name">{{ t.name }}</div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="cta-section">
        <div class="about-container" style="text-align:center">
          <h2 style="color:#fff; font-size:2rem; margin-bottom:12px;">Join Our Community</h2>
          <p style="color:rgba(255,255,255,0.8); margin-bottom:28px;">Be part of a growing community of 50,000+ learners worldwide.</p>
          <a routerLink="/register" class="btn btn-primary btn-lg">Get Started Free</a>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .about-hero {
      background: linear-gradient(145deg, var(--primary-subtle), var(--white));
      padding: 80px 0; text-align: center;
      border-bottom: 1px solid var(--gray-200);
    }
    .about-container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
    .about-hero h1 { font-size: 2.8rem; font-weight: 800; color: var(--gray-900); margin-bottom: 12px; }
    .about-hero p { font-size: 1.1rem; color: var(--gray-500); max-width: 540px; margin: 0 auto; }
    .section { padding: 80px 0; }
    .section-gray { background: var(--gray-50); }
    .section-eyebrow {
      font-size: 0.78rem; font-weight: 700; letter-spacing: 0.08em;
      text-transform: uppercase; color: var(--primary); margin-bottom: 12px;
    }
    .section-head-center { text-align: center; margin-bottom: 48px; }
    .section-title { font-size: 1.85rem; font-weight: 700; margin-bottom: 6px; }
    .section-subtitle { color: var(--gray-500); }

    .mission-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; }
    .mission-content h2 { font-size: 1.7rem; font-weight: 700; margin-bottom: 16px; }
    .mission-content p { color: var(--gray-600); line-height: 1.8; margin-bottom: 12px; }
    .mission-content .btn { margin-top: 12px; }
    .mission-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .mission-stat {
      background: var(--white); border: 1px solid var(--gray-200);
      border-radius: var(--radius-lg); padding: 28px; text-align: center;
      box-shadow: var(--shadow-sm);
    }
    .ms-value { font-family: var(--font-display); font-size: 2rem; font-weight: 800; color: var(--primary); }
    .ms-label { font-size: 0.875rem; color: var(--gray-500); margin-top: 4px; }

    .values-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
    .value-card {
      background: var(--white); border: 1px solid var(--gray-200);
      border-radius: var(--radius-lg); padding: 28px; transition: var(--transition);
    }
    .value-card:hover { box-shadow: var(--shadow); transform: translateY(-2px); }
    .value-icon {
      width: 52px; height: 52px; border-radius: 14px;
      background: var(--primary-light); color: var(--primary);
      display: flex; align-items: center; justify-content: center;
      font-size: 1.3rem; margin-bottom: 16px;
    }
    .value-card h3 { font-size: 1rem; font-weight: 600; margin-bottom: 8px; }
    .value-card p { font-size: 0.875rem; color: var(--gray-500); line-height: 1.6; }

    .tech-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px; }
    .tech-item {
      background: var(--white); border: 1px solid var(--gray-200);
      border-radius: var(--radius-lg); padding: 20px;
      text-align: center; transition: var(--transition);
    }
    .tech-item:hover { border-color: var(--primary); box-shadow: var(--shadow); }
    .tech-icon { font-size: 1.5rem; color: var(--primary); margin-bottom: 8px; }
    .tech-name { font-size: 0.8rem; font-weight: 600; color: var(--gray-600); }

    .cta-section { background: linear-gradient(135deg, #0f4fd1, #1a6bff); padding: 80px 0; }

    @media (max-width: 900px) {
      .mission-grid { grid-template-columns: 1fr; }
      .values-grid { grid-template-columns: 1fr 1fr; }
      .tech-grid { grid-template-columns: repeat(3, 1fr); }
    }
    @media (max-width: 600px) {
      .values-grid { grid-template-columns: 1fr; }
      .tech-grid { grid-template-columns: repeat(2, 1fr); }
      .mission-stats { grid-template-columns: 1fr; }
    }
  `]
})
export class AboutComponent {
  missionStats = [
    { value: '50K+', label: 'Active Students' },
    { value: '500+', label: 'Courses' },
    { value: '120+', label: 'Instructors' },
    { value: '98%', label: 'Satisfaction Rate' }
  ];

  values = [
    { icon: 'fa-globe', title: 'Accessibility', desc: 'We believe everyone deserves access to world-class education, regardless of location or background.' },
    { icon: 'fa-award', title: 'Quality', desc: 'Every course on Learnova is reviewed for accuracy, depth, and practical value before publishing.' },
    { icon: 'fa-users', title: 'Community', desc: 'Learning is better together. Our forums and discussions keep you connected with peers and mentors.' },
    { icon: 'fa-bolt', title: 'Innovation', desc: 'We continuously improve our platform using the latest technology to enhance your learning experience.' },
    { icon: 'fa-heart', title: 'Learner First', desc: 'Every feature we build starts with one question: does this make learning better for our students?' },
    { icon: 'fa-shield-alt', title: 'Trust & Safety', desc: 'Your data and privacy are protected with enterprise-grade security and transparent policies.' }
  ];

  techStack = [
    { icon: 'fa-layer-group', name: 'Spring Boot' },
    { icon: 'fa-angular', name: 'Angular 17' },
    { icon: 'fa-database', name: 'MySQL' },
    { icon: 'fa-docker', name: 'Docker' },
    { icon: 'fa-key', name: 'JWT Security' },
    { icon: 'fa-cloud', name: 'Eureka' },
    { icon: 'fa-envelope', name: 'RabbitMQ' },
    { icon: 'fa-tachometer-alt', name: 'Redis' },
    { icon: 'fa-code', name: 'Swagger' },
    { icon: 'fa-route', name: 'API Gateway' }
  ];
}
