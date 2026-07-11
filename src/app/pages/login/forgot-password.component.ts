import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="login-shell">

      <!-- Hero Side -->
      <div class="hero-side">
        <div class="hero-content">
          <div class="logo-icon">🔐</div>
          <h1>Forgot <span class="text-cyan">Password</span></h1>
          <p class="subtitle">Reset your password securely using your registered email or phone number.</p>
          <div class="features">
            <div class="feature-item">📧 Email OTP Verification</div>
            <div class="feature-item">🔒 Secure Password Reset</div>
            <div class="feature-item">⚡ Quick Recovery</div>
          </div>
        </div>
        <div class="bg-circle circle-1"></div>
        <div class="bg-circle circle-2"></div>
      </div>

      <!-- Form Side -->
      <div class="form-side">
        <div class="login-card">

          <div class="card-header">
            <div class="logo-icon-sm">🔐</div>
            <h3>Forgot Password</h3>
            <p>Choose how you want to receive your OTP</p>
          </div>

          <!-- Alerts -->
          <div class="alert error-msg" *ngIf="errorMsg">❌ {{ errorMsg }}</div>
          <div class="alert success-msg" *ngIf="successMsg">✅ {{ successMsg }}</div>

          <!-- Tab Toggle -->
          <div class="tab-toggle">
            <button class="tab-btn" [class.active]="activeTab === 'email'"
                    (click)="activeTab = 'email'; errorMsg = ''; successMsg = ''">
              📧 Email
            </button>
            <button class="tab-btn" [class.active]="activeTab === 'phone'"
                    (click)="activeTab = 'phone'; errorMsg = ''; successMsg = ''">
              📞 Phone
            </button>
          </div>

          <!-- Email Tab -->
          <div *ngIf="activeTab === 'email'">
            <form (ngSubmit)="sendEmailOtp()">
              <div class="input-group">
                <label>Email Address</label>
                <div class="input-wrapper">
                  <span class="input-icon">📧</span>
                  <input type="email" name="email" [(ngModel)]="email"
                         placeholder="Enter registered email" required />
                </div>
              </div>
              <button class="btn-login" [disabled]="loading">
                {{ loading ? 'Sending OTP...' : 'Send OTP via Email' }}
              </button>
            </form>
          </div>

          <!-- Phone Tab -->
          <div *ngIf="activeTab === 'phone'">
            <!-- Unavailable Notice -->
            <div class="unavailable-notice">
              <div class="un-icon">🚧</div>
              <div class="un-title">Service Temporarily Unavailable</div>
              <div class="un-desc">
                SMS OTP service is currently unavailable. Please use
                <strong>Email OTP</strong> to reset your password.
              </div>
              <button class="btn-switch" (click)="activeTab = 'email'">
                📧 Switch to Email OTP
              </button>
            </div>
          </div>

          <div class="auth-link">
            Remember password? <a routerLink="/login">Login</a>
          </div>

        </div>
      </div>

    </div>
  `,
  styles: [`
    :host { display:block; font-family:Inter,sans-serif; }
    * { box-sizing:border-box; }
    .login-shell { display:flex; min-height:100vh; background:#f8fafc; }

    /* Hero */
    .hero-side { flex:1.2; background:linear-gradient(135deg,#0f172a,#1e293b,#0891b2); display:flex; justify-content:center; align-items:center; position:relative; overflow:hidden; padding:3rem; }
    .hero-content { color:white; max-width:450px; z-index:2; }
    .logo-icon { font-size:70px; margin-bottom:15px; }
    .text-cyan { color:#22d3ee; }
    .subtitle { margin:20px 0; line-height:1.6; color:#cbd5e1; }
    .features { display:flex; flex-direction:column; gap:15px; }
    .feature-item { padding:14px; border-radius:12px; background:rgba(255,255,255,.08); }
    .bg-circle { position:absolute; border-radius:50%; filter:blur(60px); }
    .circle-1 { width:300px; height:300px; background:#0891b2; top:-100px; left:-80px; opacity:.35; }
    .circle-2 { width:250px; height:250px; background:#38bdf8; bottom:-80px; right:-60px; opacity:.3; }

    /* Form */
    .form-side { flex:1; display:flex; justify-content:center; align-items:center; padding:2rem; }
    .login-card { background:white; padding:40px; border-radius:20px; width:100%; max-width:450px; box-shadow:0 10px 40px rgba(0,0,0,.08); }
    .card-header { text-align:center; margin-bottom:20px; }
    .logo-icon-sm { font-size:2.5rem; margin-bottom:.5rem; }
    .card-header h3 { font-size:1.4rem; font-weight:700; margin-bottom:5px; }
    .card-header p { color:#64748b; font-size:.88rem; }

    /* Alerts */
    .alert { padding:12px; border-radius:10px; margin-bottom:16px; text-align:center; font-size:.88rem; }
    .error-msg { background:#fee2e2; color:#991b1b; }
    .success-msg { background:#dcfce7; color:#166534; }

    /* Tab Toggle */
    .tab-toggle { display:flex; background:#f1f5f9; border-radius:12px; padding:4px; margin-bottom:20px; gap:4px; }
    .tab-btn { flex:1; padding:10px; border:none; background:transparent; border-radius:9px; font-size:.9rem; font-weight:600; cursor:pointer; color:#64748b; transition:all .2s; }
    .tab-btn.active { background:#fff; color:#0891b2; box-shadow:0 2px 8px rgba(0,0,0,.1); }

    /* Input */
    .input-group { margin-bottom:20px; }
    .input-group label { display:block; margin-bottom:6px; font-weight:600; font-size:.88rem; }
    .input-wrapper { position:relative; }
    .input-icon { position:absolute; left:12px; top:13px; }
    input { width:100%; padding:13px 13px 13px 40px; border-radius:10px; border:1.5px solid #e2e8f0; outline:none; font-size:.9rem; }
    input:focus { border-color:#0891b2; }

    /* Button */
    .btn-login { width:100%; padding:14px; background:#0891b2; border:none; color:white; border-radius:10px; font-size:1rem; font-weight:700; cursor:pointer; transition:background .2s; }
    .btn-login:hover { background:#0e7490; }
    .btn-login:disabled { opacity:.6; cursor:not-allowed; }

    /* Unavailable Notice */
    .unavailable-notice { background:#fef3c7; border:2px solid #f59e0b; border-radius:14px; padding:24px; text-align:center; margin-bottom:16px; }
    .un-icon { font-size:2.5rem; margin-bottom:8px; }
    .un-title { font-weight:700; font-size:1rem; color:#92400e; margin-bottom:8px; }
    .un-desc { font-size:.85rem; color:#78350f; line-height:1.6; margin-bottom:16px; }
    .btn-switch { background:#0891b2; color:#fff; border:none; padding:10px 24px; border-radius:9px; font-weight:700; cursor:pointer; font-size:.9rem; }
    .btn-switch:hover { background:#0e7490; }

    /* Auth link */
    .auth-link { margin-top:20px; text-align:center; font-size:.88rem; color:#64748b; }
    .auth-link a { color:#0891b2; text-decoration:none; font-weight:600; }

    @media(max-width:900px) { .hero-side { display:none; } .form-side { width:100%; } }
  `]
})
export class ForgotPasswordComponent {
  activeTab  = 'email';
  email      = '';
  loading    = false;
  errorMsg   = '';
  successMsg = '';

  constructor(private http: HttpClient, private router: Router) {}

  sendEmailOtp() {
    if (!this.email) { this.errorMsg = 'Please enter email address'; return; }

    this.loading    = true;
    this.errorMsg   = '';
    this.successMsg = '';

    this.http.post<any>(
      `${environment.apiUrl}/Auth/send-otp-email`,
      { email: this.email }
    ).subscribe({
      next: res => {
        this.loading = false;
        if (res.success) {
          this.successMsg = '✅ OTP sent! Check your email.';
          setTimeout(() => {
            this.router.navigate(['/reset-password'], {
              queryParams: { email: this.email }
            });
          }, 1500);
        } else {
          this.errorMsg = res.message ?? 'Failed to send OTP';
        }
      },
      error: err => {
        this.loading  = false;
        this.errorMsg = err.error?.message ?? 'Email not registered or service error';
      }
    });
  }
}