import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // ── Public routes — login se pehle ──
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/login/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'forgot-password',   // ← auth guard ke BAHAR
    loadComponent: () =>
      import('./pages/login/forgot-password.component').then(m => m.ForgotPasswordComponent)
  },
  {
    path: 'reset-password',    // ← auth guard ke BAHAR
    loadComponent: () =>
      import('./pages/login/reset-password.component').then(m => m.ResetPasswordComponent)
  },


  // ── Protected routes — login ke baad ──
  {
    path: '',
    loadComponent: () =>
      import('./layout/layout.component').then(m => m.LayoutComponent),
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'customers',
        loadComponent: () =>
          import('./pages/customers/customers.component').then(m => m.CustomersComponent)
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./pages/products/product.component').then(m => m.ProductsComponent)
      },
      {
        path: 'daily-report',
        loadComponent: () =>
          import('./pages/daily-report/daily-report.component').then(m => m.DailyReportComponent)
      },
      {
        path: 'bills',
        loadComponent: () =>
          import('./pages/bills/bills.component').then(m => m.BillsComponent)
      },
      
 {
  path: 'profile',
  loadComponent: () =>
    import('./pages/profile/profile.component').then(m => m.ProfileComponent)
},
{
    path: 'ai',
    loadComponent: () =>
        import('./pages/AI/ai.component').then(m => m.AIComponent)
},
    ]
  },
  { path: '**', redirectTo: '' }
];