import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="footer">
      <div class="footer-container">
        <div class="footer-grid">
          <div class="footer-brand-col">
            <div class="footer-brand">
              <div class="brand-icon"><i class="fas fa-graduation-cap"></i></div>
              <span>Learnova</span>
            </div>
            <p class="footer-tagline">
              Empowering learners worldwide with quality online education. Learn at your pace, from anywhere.
            </p>
            <div class="social-links">
              <a href="#" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
              <a href="#" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
              <a href="#" aria-label="YouTube"><i class="fab fa-youtube"></i></a>
              <a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
            </div>
          </div>

          <div class="footer-links-col">
            <h4>Platform</h4>
            <ul>
              <li><a routerLink="/courses">Browse Courses</a></li>
              <li><a routerLink="/register">Become a Student</a></li>
              <li><a routerLink="/register">Teach on Learnova</a></li>
              <li><a routerLink="/about">About Us</a></li>
            </ul>
          </div>

          <div class="footer-links-col">
            <h4>Support</h4>
            <ul>
              <li><a routerLink="/contact">Help Center</a></li>
              <li><a routerLink="/contact">Contact Us</a></li>
              <li><a href="#">Community Forum</a></li>
              <li><a href="#">Status Page</a></li>
            </ul>
          </div>

          <div class="footer-links-col">
            <h4>Legal</h4>
            <ul>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Cookie Policy</a></li>
              <li><a href="#">Accessibility</a></li>
            </ul>
          </div>
        </div>

        <div class="footer-bottom">
          <p>&copy; {{ year }} Learnova OLMS. All rights reserved.</p>
          <p class="footer-tech">Built with <i class="fas fa-heart text-primary"></i> using Angular & Spring Boot</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: var(--gray-900);
      color: var(--gray-400);
      padding: 64px 0 0;
    }
    .footer-container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
    .footer-grid {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr;
      gap: 48px;
      padding-bottom: 48px;
    }
    .footer-brand {
      display: flex; align-items: center; gap: 10px; margin-bottom: 16px;
    }
    .brand-icon {
      width: 36px; height: 36px;
      background: linear-gradient(135deg, var(--primary), #4d9dff);
      border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      color: #fff; font-size: 0.9rem; flex-shrink: 0;
    }
    .footer-brand span {
      font-family: var(--font-display); font-size: 1.2rem; font-weight: 700;
      color: var(--white);
    }
    .footer-tagline { font-size: 0.875rem; line-height: 1.7; color: var(--gray-400); margin-bottom: 20px; }
    .social-links { display: flex; gap: 10px; }
    .social-links a {
      width: 36px; height: 36px; border-radius: var(--radius);
      background: var(--gray-800);
      display: flex; align-items: center; justify-content: center;
      color: var(--gray-400); font-size: 0.875rem;
      transition: var(--transition);
    }
    .social-links a:hover { background: var(--primary); color: #fff; transform: translateY(-2px); }
    .footer-links-col h4 {
      font-family: var(--font-display); font-size: 0.875rem; font-weight: 600;
      color: var(--white); text-transform: uppercase; letter-spacing: 0.06em;
      margin-bottom: 16px;
    }
    .footer-links-col ul { list-style: none; display: flex; flex-direction: column; gap: 10px; }
    .footer-links-col a {
      font-size: 0.875rem; color: var(--gray-400);
      transition: var(--transition);
    }
    .footer-links-col a:hover { color: var(--white); }
    .footer-bottom {
      border-top: 1px solid var(--gray-800);
      padding: 20px 0;
      display: flex; justify-content: space-between; align-items: center;
    }
    .footer-bottom p { font-size: 0.8125rem; }
    .footer-tech { color: var(--gray-500); }
    .text-primary { color: var(--primary); }
    @media (max-width: 900px) {
      .footer-grid { grid-template-columns: 1fr 1fr; }
      .footer-brand-col { grid-column: 1 / -1; }
    }
    @media (max-width: 600px) {
      .footer-grid { grid-template-columns: 1fr; gap: 32px; }
      .footer-bottom { flex-direction: column; gap: 8px; text-align: center; }
    }
  `]
})
export class FooterComponent {
  year = new Date().getFullYear();
}
