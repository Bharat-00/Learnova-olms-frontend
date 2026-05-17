# 🎓 Learnova OLMS — Online Learning Management System

A production-ready Angular 17 frontend for a microservices-based LMS.

## Tech Stack
- **Angular 17** (Standalone Components, Lazy Loading)
- **TypeScript 5.4**
- **JWT Authentication** (localStorage, auto-attach interceptor)
- **Reactive Forms** with full validation
- **Role-based Guards** (STUDENT, INSTRUCTOR, ADMIN)
- **Bootstrap-free** custom CSS design system

---

## Getting Started

### Prerequisites
- Node.js 18+
- Angular CLI 17+
- Spring Boot API Gateway running on `http://localhost:8080`

### Installation & Run

```bash
cd learnova-olms
npm install
ng serve
```

Open: **http://localhost:4200**

---

## Project Structure

```
src/
├── app/
│   ├── core/
│   │   ├── guards/          # authGuard, roleGuard
│   │   ├── interceptors/    # authInterceptor, errorInterceptor
│   │   ├── models/          # All TypeScript interfaces
│   │   └── services/        # 11 API services
│   ├── shared/
│   │   ├── components/      # navbar, footer, sidebar, course-card, etc.
│   │   └── layouts/         # public-layout, auth-layout, dashboard-layout
│   └── features/
│       ├── auth/            # login, register, forgot-password
│       ├── public/          # landing, courses, course-detail, about, contact
│       ├── student/         # full student portal (10 pages)
│       ├── instructor/      # full instructor portal (12 pages)
│       └── admin/           # full admin portal (10 pages)
├── environments/
│   ├── environment.ts       # apiBaseUrl: http://localhost:8080
│   └── environment.prod.ts
└── styles.css               # Global design system (CSS variables)
```

---

## Backend API Endpoints

All services proxied through API Gateway at `http://localhost:8080`:

| Service         | Path                    |
|-----------------|-------------------------|
| auth-service    | `/api/auth`             |
| user-service    | `/api/users`            |
| course-service  | `/api/courses`          |
| enrollment-service | `/api/enrollments`   |
| lesson-service  | `/api/lessons`          |
| assesment-service | `/api/assesments`     |
| progress-service | `/api/progress`        |
| payment-service | `/api/payments`         |
| discussion-service | `/api/discussions`   |
| notification-service | `/api/notifications` |
| certificate (via user-service) | `/api/certificates` |

> ⚠️ Note: `assesment` spelling (single 's') is intentional to match backend service.

---

## Demo Accounts (via login page quick-login buttons)

| Role       | Email                        | Password    |
|------------|------------------------------|-------------|
| Student    | student@learnova.com         | password123 |
| Instructor | instructor@learnova.com      | password123 |
| Admin      | admin@learnova.com           | password123 |

---

## Routes

### Public
- `/` — Landing page
- `/courses` — Course catalog with search & filters
- `/courses/:id` — Course detail & enrollment
- `/about` — About page
- `/contact` — Contact & FAQ

### Auth
- `/login`, `/register`, `/forgot-password`

### Student (`/student/*`) — Requires `STUDENT` role
- `dashboard`, `courses`, `lesson/:lessonId`, `progress`
- `assesments/:quizId`, `attempt-result/:attemptId`
- `payments`, `certificates`, `discussions`, `notifications`, `profile`

### Instructor (`/instructor/*`) — Requires `INSTRUCTOR` role
- `dashboard`, `courses`, `courses/create`, `courses/edit/:id`
- `lessons/:courseId`, `lessons/:courseId/add`
- `assesments/:courseId`, `assesments/:courseId/add`
- `students`, `discussions`, `analytics`, `notifications`, `profile`

### Admin (`/admin/*`) — Requires `ADMIN` role
- `dashboard`, `users`, `courses`, `payments`, `subscriptions`
- `certificates`, `analytics`, `notifications`, `discussions`, `profile`

---

## Design System

CSS variables defined in `src/styles.css`:

```css
--primary: #1a6bff
--primary-dark: #0f4fd1
--success: #10b981
--warning: #f59e0b
--danger: #ef4444
--font-display: 'Sora'
--font-body: 'DM Sans'
```

---

## Backend Not Running?

The UI shows friendly empty states and error messages if the API is unreachable. No crashes. The login page includes demo quick-login buttons for testing UI flows.
