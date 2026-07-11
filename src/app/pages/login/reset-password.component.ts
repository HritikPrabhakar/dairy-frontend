import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService, ApiResponse } from '../../core/services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="login-shell">

      <div class="hero-side">
        <div class="hero-content">
          <div class="logo-icon">🔑</div>
          <h1>Reset <span class="text-cyan">Password</span></h1>
          <p class="subtitle">Enter the OTP sent to your phone and set a new password.</p>
          <div class="features">
            <div class="feature-item">📲 OTP Verification</div>
            <div class="feature-item">🔒 Secure Reset</div>
            <div class="feature-item">✅ Instant Access</div>
          </div>
        </div>
        <div class="bg-circle circle-1"></div>
        <div class="bg-circle circle-2"></div>
      </div>

      <div class="form-side">
        <div class="login-card">

          <div class="card-header">
            <div class="logo-icon-sm">🔑</div>
            <h3>Reset Password</h3>
            <p>OTP sent to <strong>{{ phone }}</strong></p>
          </div>

          <div class="alert error-msg" *ngIf="errorMsg">❌ {{ errorMsg }}</div>
          <div class="alert success-msg" *ngIf="successMsg">✅ {{ successMsg }}</div>

          <form (ngSubmit)="resetPassword()">

            <div class="input-group">
              <label>OTP</label>
              <div class="input-wrapper">
                <span class="input-icon">🔢</span>
                <input type="text" name="otp" [(ngModel)]="otp"
                       placeholder="Enter 6-digit OTP" required maxlength="6" />
              </div>
            </div>

            <div class="input-group">
              <label>New Password</label>
              <div class="input-wrapper">
                <span class="input-icon">🔒</span>
                <input [type]="showPwd ? 'text' : 'password'"
                       name="newPassword" [(ngModel)]="newPassword"
                       placeholder="Enter new password" required />
                <span class="eye-btn" (click)="showPwd = !showPwd">
                  {{ showPwd ? '🙈' : '👁️' }}
                </span>
              </div>
            </div>

            <div class="input-group">
              <label>Confirm Password</label>
              <div class="input-wrapper">
                <span class="input-icon">🔒</span>
                <input [type]="showConfirm ? 'text' : 'password'"
                       name="confirmPassword" [(ngModel)]="confirmPassword"
                       placeholder="Confirm new password" required />
                <span class="eye-btn" (click)="showConfirm = !showConfirm">
                  {{ showConfirm ? '🙈' : '👁️' }}
                </span>
              </div>
            </div>

            <button class="btn-login" [disabled]="loading">
              {{ loading ? 'Resetting...' : 'Reset Password' }}
            </button>

            <div class="auth-link">
              Remember password? <a routerLink="/login">Login</a>
            </div>

          </form>
        </div>
      </div>

    </div>
  `,
  styles: [`
    :host { display:block; font-family:Inter,sans-serif; }
    * { box-sizing:border-box; }
    .login-shell { display:flex; min-height:100vh; background:#f8fafc; }
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
    .form-side { flex:1; display:flex; justify-content:center; align-items:center; padding:2rem; }
    .login-card { background:white; padding:40px; border-radius:20px; width:100%; max-width:450px; box-shadow:0 10px 40px rgba(0,0,0,.08); }
    .card-header { text-align:center; margin-bottom:25px; }
    .logo-icon-sm { font-size:2rem; margin-bottom:.5rem; }
    .card-header h3 { margin-bottom:5px; font-size:1.4rem; }
    .card-header p { color:#64748b; font-size:.88rem; }
    .input-group { margin-bottom:20px; }
    .input-group label { display:block; margin-bottom:6px; font-weight:600; font-size:.88rem; }
    .input-wrapper { position:relative; }
    .input-icon { position:absolute; left:12px; top:13px; }
    .eye-btn { position:absolute; right:12px; top:13px; cursor:pointer; font-size:.9rem; }
    input { width:100%; padding:13px 13px 13px 40px; border-radius:10px; border:1px solid #ddd; outline:none; font-size:.9rem; }
    input:focus { border-color:#0891b2; }
    .btn-login { width:100%; padding:14px; background:#0891b2; border:none; color:white; border-radius:10px; font-size:16px; font-weight:700; cursor:pointer; }
    .btn-login:hover { background:#0e7490; }
    .btn-login:disabled { opacity:.6; cursor:not-allowed; }
    .alert { padding:12px; border-radius:10px; margin-bottom:18px; text-align:center; font-size:.88rem; }
    .error-msg { background:#fee2e2; color:#991b1b; }
    .success-msg { background:#dcfce7; color:#166534; }
    .auth-link { margin-top:20px; text-align:center; font-size:.88rem; }
    .auth-link a { color:#0891b2; text-decoration:none; font-weight:600; }
    @media(max-width:900px) { .hero-side { display:none; } .form-side { width:100%; } }
  `]
})
export class ResetPasswordComponent {
  phone       = '';
  otp         = '';
  newPassword = '';
  confirmPassword = '';
  loading     = false;
  errorMsg    = '';
  successMsg  = '';
  showPwd     = false;
  showConfirm = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // forgot-password se phone query param aayega
    this.phone = this.route.snapshot.queryParams['phone'] ?? '';
  }

  resetPassword() {
    if (!this.otp || !this.newPassword || !this.confirmPassword) {
      this.errorMsg = 'Please fill all fields';
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.errorMsg = 'Passwords do not match';
      return;
    }
    if (this.newPassword.length < 6) {
      this.errorMsg = 'Password must be at least 6 characters';
      return;
    }

    this.loading  = true;
    this.errorMsg = '';

    this.auth.resetPassword({
      phone:       this.phone,
      otp:         this.otp,
      newPassword: this.newPassword
    }).subscribe({
      next: (res: ApiResponse) => {
        this.loading = false;
        if (res.success) {
          this.successMsg = 'Password reset successfully! Redirecting to login...';
          setTimeout(() => this.router.navigate(['/login']), 1500);
        } else {
          this.errorMsg = res.message ?? 'Reset failed';
        }
      },
      error: (err: any) => {
        this.loading  = false;
        this.errorMsg = err.error?.message ?? 'Invalid OTP or request failed';
      }
    });
  }
}