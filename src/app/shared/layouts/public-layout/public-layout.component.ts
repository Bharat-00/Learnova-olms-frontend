import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  template: `
    <app-navbar />
    <main class="public-main">
      <router-outlet />
    </main>
    <app-footer />
  `,
  styles: [`
    .public-main { min-height: calc(100vh - 68px); }
  `]
})
export class PublicLayoutComponent {}
