import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [

  // ── Public Layout ─────────────────────────────────────────
  {
    path: '',
    loadComponent: () =>
      import('./shared/layouts/public-layout/public-layout.component')
        .then(m => m.PublicLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/public/landing/landing.component')
            .then(m => m.LandingComponent)
      },
      {
        path: 'courses',
        loadComponent: () =>
          import('./features/public/courses/courses.component')
            .then(m => m.CoursesComponent)
      },
      {
        path: 'courses/:id',
        loadComponent: () =>
          import('./features/public/course-detail/course-detail.component')
            .then(m => m.CourseDetailComponent)
      },
      {
        path: 'about',
        loadComponent: () =>
          import('./features/public/about/about.component')
            .then(m => m.AboutComponent)
      },
      {
        path: 'contact',
        loadComponent: () =>
          import('./features/public/contact/contact.component')
            .then(m => m.ContactComponent)
      },
    ]
  },

  // ── Auth Layout ───────────────────────────────────────────
  {
    path: '',
    loadComponent: () =>
      import('./shared/layouts/auth-layout/auth-layout.component')
        .then(m => m.AuthLayoutComponent),
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/login/login.component')
            .then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./features/auth/register/register.component')
            .then(m => m.RegisterComponent)
      },
      {
        path: 'forgot-password',
        loadComponent: () =>
          import('./features/auth/forgot-password/forgot-password.component')
            .then(m => m.ForgotPasswordComponent)
      },
    ]
  },

  // ── Student Routes ────────────────────────────────────────
  {
    path: 'student',
    canActivate: [authGuard, roleGuard(['STUDENT'])],
    loadComponent: () =>
      import('./shared/layouts/dashboard-layout/dashboard-layout.component')
        .then(m => m.DashboardLayoutComponent),
    data: { role: 'STUDENT' },
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/student/dashboard/student-dashboard.component')
            .then(m => m.StudentDashboardComponent)
      },
      {
        path: 'courses',
        loadComponent: () =>
          import('./features/student/my-courses/my-courses.component')
            .then(m => m.MyCoursesComponent)
      },
      {
        path: 'my-courses',
        redirectTo: 'courses'
      },
      {
        path: 'lesson/:lessonId',
        loadComponent: () =>
          import('./features/student/watch-lesson/watch-lesson.component')
            .then(m => m.WatchLessonComponent)
      },
      {
        path: 'progress',
        loadComponent: () =>
          import('./features/student/progress/progress.component')
            .then(m => m.ProgressComponent)
      },
      {
        path: 'assesments/:quizId',
        loadComponent: () =>
          import('./features/student/assesments/assesments.component')
            .then(m => m.AssesmentsComponent)
      },
      {
        path: 'attempt-result/:attemptId',
        loadComponent: () =>
          import('./features/student/attempt-result/attempt-result.component')
            .then(m => m.AttemptResultComponent)
      },
      {
        path: 'payments',
        loadComponent: () =>
          import('./features/student/payments/payments.component')
            .then(m => m.PaymentsComponent)
      },
      {
        path: 'certificates',
        loadComponent: () =>
          import('./features/student/certificates/certificates.component')
            .then(m => m.CertificatesComponent)
      },
      {
        path: 'discussions',
        loadComponent: () =>
          import('./features/student/discussions/discussions.component')
            .then(m => m.DiscussionsComponent)
      },
      {
        path: 'notifications',
        loadComponent: () =>
          import('./features/student/notifications/notifications.component')
            .then(m => m.NotificationsComponent)
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/student/profile/profile.component')
            .then(m => m.ProfileComponent)
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // ── Instructor Routes ─────────────────────────────────────
  {
    path: 'instructor',
    canActivate: [authGuard, roleGuard(['INSTRUCTOR'])],
    loadComponent: () =>
      import('./shared/layouts/dashboard-layout/dashboard-layout.component')
        .then(m => m.DashboardLayoutComponent),
    data: { role: 'INSTRUCTOR' },
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/instructor/dashboard/instructor-dashboard.component')
            .then(m => m.InstructorDashboardComponent)
      },
      {
        path: 'courses',
        loadComponent: () =>
          import('./features/instructor/courses/instructor-courses.component')
            .then(m => m.InstructorCoursesComponent)
      },
      {
        path: 'courses/create',
        loadComponent: () =>
          import('./features/instructor/create-course/create-course.component')
            .then(m => m.CreateCourseComponent)
      },
      {
        path: 'courses/edit/:id',
        loadComponent: () =>
          import('./features/instructor/edit-course/edit-course.component')
            .then(m => m.EditCourseComponent)
      },
      {
        path: 'lessons/:courseId',
        loadComponent: () =>
          import('./features/instructor/manage-lessons/manage-lessons.component')
            .then(m => m.ManageLessonsComponent)
      },
      {
        path: 'lessons/:courseId/add',
        loadComponent: () =>
          import('./features/instructor/add-lesson/add-lesson.component')
            .then(m => m.AddLessonComponent)
      },
      {
        path: 'assesments/:courseId',
        loadComponent: () =>
          import('./features/instructor/manage-assesments/manage-assesments.component')
            .then(m => m.ManageAssesmentsComponent)
      },
      {
        path: 'assesments/:courseId/add',
        loadComponent: () =>
          import('./features/instructor/add-assesment/add-assesment.component')
            .then(m => m.AddAssesmentComponent)
      },
      {
        path: 'students',
        loadComponent: () =>
          import('./features/instructor/students/instructor-students.component')
            .then(m => m.InstructorStudentsComponent)
      },
      {
        path: 'discussions',
        loadComponent: () =>
          import('./features/instructor/discussions/instructor-discussions.component')
            .then(m => m.InstructorDiscussionsComponent)
      },
      {
        path: 'analytics',
        loadComponent: () =>
          import('./features/instructor/analytics/instructor-analytics.component')
            .then(m => m.InstructorAnalyticsComponent)
      },
      {
        path: 'notifications',
        loadComponent: () =>
          import('./features/instructor/notifications/instructor-notifications.component')
            .then(m => m.InstructorNotificationsComponent)
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/instructor/profile/instructor-profile.component')
            .then(m => m.InstructorProfileComponent)
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // ── Admin Routes ──────────────────────────────────────────
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard(['ADMIN'])],
    loadComponent: () =>
      import('./shared/layouts/dashboard-layout/dashboard-layout.component')
        .then(m => m.DashboardLayoutComponent),
    data: { role: 'ADMIN' },
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/admin/dashboard/admin-dashboard.component')
            .then(m => m.AdminDashboardComponent)
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./features/admin/users/admin-users.component')
            .then(m => m.AdminUsersComponent)
      },
      {
        path: 'courses',
        loadComponent: () =>
          import('./features/admin/courses/admin-courses.component')
            .then(m => m.AdminCoursesComponent)
      },
      {
        path: 'payments',
        loadComponent: () =>
          import('./features/admin/payments/admin-payments.component')
            .then(m => m.AdminPaymentsComponent)
      },
      {
        path: 'subscriptions',
        loadComponent: () =>
          import('./features/admin/subscriptions/admin-subscriptions.component')
            .then(m => m.AdminSubscriptionsComponent)
      },
      {
        path: 'certificates',
        loadComponent: () =>
          import('./features/admin/certificates/admin-certificates.component')
            .then(m => m.AdminCertificatesComponent)
      },
      {
        path: 'analytics',
        loadComponent: () =>
          import('./features/admin/analytics/admin-analytics.component')
            .then(m => m.AdminAnalyticsComponent)
      },
      {
        path: 'notifications',
        loadComponent: () =>
          import('./features/admin/notifications/admin-notifications.component')
            .then(m => m.AdminNotificationsComponent)
      },
      {
        path: 'discussions',
        loadComponent: () =>
          import('./features/admin/discussions/admin-discussions.component')
            .then(m => m.AdminDiscussionsComponent)
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/admin/profile/admin-profile.component')
            .then(m => m.AdminProfileComponent)
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  { path: '**', redirectTo: '' }
];
