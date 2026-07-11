import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="login-shell">
      <div class="left">
        <div class="hero">
          <div class="logo">🥛</div>
          <h1>Dairy <span>Management</span></h1>
          <p>Complete solution for managing your dairy business efficiently.</p>
          
          <div class="features">
            <div class="feature">🚀 Fast & Secure Login</div>
            <div class="feature">🔒 JWT Authentication</div>
            <div class="feature">📊 Manage Dairy Anywhere</div>
          </div>
        </div>
      </div>
      
      <div class="right">
        <div class="card">
          <div class="mobile-brand">
            🥛 Dairy Admin
          </div>
          
          <h2>Welcome Back 👋</h2>
          <p class="subtitle">Login to continue managing your dairy system.</p>
          
          <div class="error" *ngIf="errorMsg">
            ❌ {{ errorMsg }}
          </div>
          
          <form (ngSubmit)="login()">
            <div class="fg">
              <label>Email or Username</label>
              <input
                type="text"
                [(ngModel)]="username"
                name="u"
                placeholder="Enter email or username" 
                required
              >
            </div>
            
            <div class="fg">
              <label>Password</label>
              <div class="password-wrapper">
                <input
                  [type]="showPassword ? 'text' : 'password'"
                  [(ngModel)]="password"
                  name="p"
                  placeholder="Enter password"
                  required
                />
                <i
                  class="fa-solid"
                  [ngClass]="showPassword ? 'fa-eye-slash' : 'fa-eye'"
                  (click)="showPassword = !showPassword">
                </i>
              </div>
            </div>
            
            <button class="btn-login" [disabled]="loading">
              {{ loading ? 'Signing In...' : 'Login 🚀' }}
            </button>
          </form>
          
          <div class="links">
            <a routerLink="/forgot-password">Forgot Password?</a>
            <span>|</span>
            <a routerLink="/register">Create Account</a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Layout */
    .login-shell {
      display: flex;
      min-height: 100vh;
      background: #f8fafc;
    }
    
    /* Password Eye Icon Styles */
    .password-wrapper {
      position: relative;
    }
    .password-wrapper i {
      position: absolute;
      right: 15px;
      top: 50%;
      transform: translateY(-50%);
      cursor: pointer;
      color: #64748b;
      font-size: 16px;
    }
    .password-wrapper i:hover {
      color: #0891b2;
    }

    .left {
      flex: 1;
      background: linear-gradient(135deg, #0f172a, #1e293b, #0891b2);
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 4rem;
      position: relative;
      overflow: hidden;
    }
    .right {
      width: 450px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      background: #f8fafc;
    }

    /* Hero Section (Left) */
    .hero {
      color: white;
      max-width: 430px;
    }
    .logo {
      font-size: 70px;
      margin-bottom: 20px;
    }
    .hero h1 {
      font-size: 42px;
      margin-bottom: 15px;
      font-weight: 800;
    }
    .hero span {
      color: #22d3ee;
    }
    .features {
      margin-top: 35px;
      display: flex;
      flex-direction: column;
      gap: 15px;
    }
    .feature {
      background: rgba(255, 255, 255, 0.08);
      padding: 15px;
      border-radius: 12px;
      backdrop-filter: blur(10px);
    }

    /* Card & Form (Right) */
    .card {
      background: white;
      border-radius: 20px;
      padding: 40px;
      width: 100%;
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.08);
    }
    .mobile-brand {
      display: none;
      text-align: center;
      font-size: 26px;
      font-weight: bold;
      margin-bottom: 20px;
    }
    .subtitle {
      color: #64748b;
      margin-bottom: 25px;
      text-align: center;
    }
    .error {
      background: #fee2e2;
      color: #ef4444;
      padding: 10px;
      border-radius: 8px;
      margin-bottom: 20px;
      font-size: 14px;
      font-weight: 500;
    }
    .fg {
      margin-bottom: 18px;
    }
    .fg label {
      display: block;
      font-weight: 600;
      margin-bottom: 6px;
      color: #475569;
    }
    .fg input {
      width: 100%;
      border: 1px solid #e2e8f0;
      outline: none;
      font-size: 15px;
      padding: 13px;
      border-radius: 10px;
      box-sizing: border-box; /* Ensures padding doesn't break width */
    }
    .password-wrapper input {
      padding-right: 40px; /* Make room for the eye icon */
    }
    .btn-login {
      margin-top: 10px;
      width: 100%;
      padding: 14px;
      background: #0891b2;
      color: white;
      border: none;
      border-radius: 12px;
      font-weight: 700;
      cursor: pointer;
      transition: 0.3s;
    }
    .btn-login:hover {
      background: #0e7490;
    }
    .btn-login:disabled {
      background: #94a3b8;
      cursor: not-allowed;
    }

    /* Links */
    .links {
      margin-top: 20px;
      display: flex;
      justify-content: center;
      gap: 12px;
      font-size: 14px;
    }
    .links a {
      color: #0891b2;
      font-weight: 600;
      text-decoration: none;
    }
    .links a:hover {
      text-decoration: underline;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .left {
        display: none;
      }
      .right {
        width: 100%;
      }
      .mobile-brand {
        display: block;
      }
      .card {
        padding: 30px;
      }
    }
  `]
})
export class LoginComponent {
  username = ''; // Still mapping to 'username' so the payload structure doesn't break
  password = '';
  loading = false;
  errorMsg = '';
  showPassword = false;

  constructor(private auth: AuthService, private router: Router) {
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/']);
    }
  }

  login() {
    if (!this.username || !this.password) {
      this.errorMsg = 'Please enter credentials';
      return;
    }

    this.loading = true;
    this.errorMsg = '';

    // The backend handles whether 'username' is actually an email or a username
    this.auth.login({ username: this.username, password: this.password }).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/']);
      },
      error: (e) => {
        // ✅ Updated Error Message
        this.errorMsg = 'Invalid email, username, or password';
        this.loading = false;
      }
    });
  }
}