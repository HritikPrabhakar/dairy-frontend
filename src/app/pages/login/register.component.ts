import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="login-shell">
      
      <div class="hero-side">
        <div class="hero-content">
          <div class="logo-icon">🥛</div>
          <h1>Join Dairy <span class="text-cyan">Admin</span></h1>
          <p class="subtitle">Create a new account to manage your dairy business efficiently.</p>
          
          <div class="features">
            <div class="feature-item"><span>🚀</span> Quick & Easy Setup</div>
            <div class="feature-item"><span>🔒</span> Secure Data Management</div>
            <div class="feature-item"><span>📱</span> Access Anywhere</div>
          </div>
        </div>
        
        <div class="bg-circle circle-1"></div>
        <div class="bg-circle circle-2"></div>
      </div>

      <div class="form-side">
        <div class="login-card">
          
          <div class="mobile-brand">
            <div class="logo-icon-sm">🥛</div>
            <h2>Dairy Admin</h2>
          </div>

          <div class="card-header">
            <h3>Create Account ✨</h3>
            <p>Fill in the details below to register.</p>
          </div>

          <div class="alert error-msg" *ngIf="errorMsg">❌ {{ errorMsg }}</div>
          <div class="alert success-msg" *ngIf="successMsg">✅ {{ successMsg }}</div>

          <form (ngSubmit)="register()">
            
            <div class="form-grid">
              <div class="input-group">
                <label>Username <span class="req">*</span></label>
                <div class="input-wrapper">
                  <span class="input-icon">👤</span>
                  <input type="text" [(ngModel)]="form.username" name="username" placeholder="johndoe" required />
                </div>
              </div>

              <div class="input-group">
                <label>Phone <span class="req">*</span></label>
                <div class="input-wrapper">
                  <span class="input-icon">📞</span>
                  <input type="tel" [(ngModel)]="form.phone" name="phone" placeholder="10-digit number" required />
                </div>
              </div>

              <div class="input-group">
                <label>Email <span class="req">*</span></label>
                <div class="input-wrapper">
                  <span class="input-icon">✉️</span>
                  <input type="email" [(ngModel)]="form.email" name="email" placeholder="john@example.com" required />
                </div>
              </div>

              <div class="input-group">
                <label>Role <span class="req">*</span></label>
                <div class="input-wrapper">
                  <span class="input-icon">🛡️</span>
                  <select [(ngModel)]="form.role" name="role" required>
                    <option value="" disabled>Select Role...</option>
                    <option value="Admin">Admin</option>
                    <option value="Manager">Manager</option>
                    <option value="Staff">Staff</option>
                  </select>
                </div>
              </div>

              <div class="input-group">
                <label>Password <span class="req">*</span></label>
                <div class="input-wrapper">
                  <span class="input-icon">🔒</span>
                  <input [type]="showPwd ? 'text' : 'password'" [(ngModel)]="form.password" name="password" placeholder="••••••••" required />
                  <button type="button" class="btn-toggle-pwd" tabindex="-1" (click)="showPwd = !showPwd">{{ showPwd ? '🙈' : '👁️' }}</button>
                </div>
              </div>

              <div class="input-group">
                <label>Confirm Password <span class="req">*</span></label>
                <div class="input-wrapper">
                  <span class="input-icon">🔐</span>
                  <input [type]="showPwd ? 'text' : 'password'" [(ngModel)]="form.confirmPassword" name="confirmPassword" placeholder="••••••••" required />
                </div>
              </div>
            </div>

            <button type="submit" class="btn-login" [disabled]="loading">
              {{ loading ? '⏳ Registering...' : 'Register Account 🚀' }}
            </button>
            
            <div class="auth-link">
              Already have an account? <a routerLink="/login">Sign in here</a>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Base */
    :host { display: block; font-family: 'Inter', 'Poppins', system-ui, -apple-system, sans-serif; }
    * { box-sizing: border-box; }

    .login-shell { display: flex; min-height: 100vh; background: #f8fafc; }

    /* === Left Side (Hero) === */
    .hero-side { 
      flex: 1.2; 
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0891b2 100%); 
      display: flex; align-items: center; justify-content: center; 
      padding: 3rem; position: relative; overflow: hidden;
    }
    
    .hero-content { color: #fff; max-width: 480px; position: relative; z-index: 10; }
    .logo-icon { font-size: 4rem; margin-bottom: 1rem; filter: drop-shadow(0 4px 10px rgba(0,0,0,0.2)); }
    h1 { font-size: 2.5rem; font-weight: 800; font-family: 'Poppins', sans-serif; line-height: 1.2; margin: 0 0 1rem 0; }
    .text-cyan { color: #22d3ee; }
    .subtitle { font-size: 1.1rem; color: #cbd5e1; margin-bottom: 2.5rem; line-height: 1.6; }
    
    .features { display: flex; flex-direction: column; gap: 1rem; }
    .feature-item { 
      background: rgba(255,255,255,0.1); backdrop-filter: blur(8px);
      padding: 0.8rem 1.2rem; border-radius: 12px; font-weight: 500; 
      display: flex; align-items: center; gap: 12px; border: 1px solid rgba(255,255,255,0.05);
    }

    .bg-circle { position: absolute; border-radius: 50%; filter: blur(60px); z-index: 1; }
    .circle-1 { width: 400px; height: 400px; background: rgba(8, 145, 178, 0.4); top: -100px; left: -100px; }
    .circle-2 { width: 300px; height: 300px; background: rgba(56, 189, 248, 0.3); bottom: -50px; right: -50px; }

    /* === Right Side (Form) === */
    .form-side { 
      flex: 1; max-width: 650px; display: flex; align-items: center; 
      justify-content: center; background: #f8fafc; padding: 2rem; 
    }
    
    .login-card { 
      background: #fff; border-radius: 20px; padding: 3rem; 
      width: 100%; max-width: 550px; box-shadow: 0 10px 40px -10px rgba(0,0,0,0.08); 
      border: 1px solid #f1f5f9;
    }

    .mobile-brand { display: none; align-items: center; justify-content: center; gap: 10px; margin-bottom: 2rem; }
    .logo-icon-sm { font-size: 2rem; }
    .mobile-brand h2 { margin: 0; font-family: 'Poppins', sans-serif; font-size: 1.5rem; color: #0f172a; }

    .card-header { margin-bottom: 2rem; text-align: center; }
    .card-header h3 { margin: 0 0 0.5rem 0; font-family: 'Poppins', sans-serif; font-size: 1.5rem; color: #0f172a; }
    .card-header p { margin: 0; color: #64748b; font-size: 0.9rem; }

    /* Form Grid */
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 1.25rem; }
    .req { color: #ef4444; }

    .input-group { margin-bottom: 1.25rem; }
    .input-group label { display: block; font-weight: 600; font-size: 0.85rem; color: #475569; margin-bottom: 0.5rem; }
    
    .input-wrapper { position: relative; display: flex; align-items: center; }
    .input-icon { position: absolute; left: 14px; font-size: 1rem; opacity: 0.7; pointer-events: none; }
    
    .input-wrapper input, .input-wrapper select { 
      width: 100%; padding: 0.8rem 1rem 0.8rem 2.8rem; border: 1.5px solid #e2e8f0; 
      border-radius: 12px; font-size: 0.9rem; font-family: inherit; color: #0f172a;
      transition: all 0.2s ease; background: #f8fafc; outline: none;
    }
    .input-wrapper select { cursor: pointer; appearance: none; }
    
    .input-wrapper input:focus, .input-wrapper select:focus { 
      border-color: #0891b2; background: #fff; box-shadow: 0 0 0 4px rgba(8,145,178,0.1); 
    }

    .btn-toggle-pwd { 
      position: absolute; right: 10px; background: none; border: none; 
      font-size: 1.1rem; cursor: pointer; padding: 5px; border-radius: 50%; transition: background 0.2s;
    }
    .btn-toggle-pwd:hover { background: #e2e8f0; }

    /* Button */
    .btn-login { 
      width: 100%; padding: 0.9rem; margin-top: 1rem; background: #0891b2; color: #fff; 
      border: none; border-radius: 12px; font-size: 1rem; font-weight: 700; font-family: inherit;
      cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 12px rgba(8,145,178,0.25);
    }
    .btn-login:hover:not(:disabled) { background: #0e7490; transform: translateY(-2px); box-shadow: 0 6px 16px rgba(8,145,178,0.3); }
    .btn-login:disabled { opacity: 0.6; cursor: not-allowed; box-shadow: none; transform: none; }

    .auth-link { text-align: center; margin-top: 1.5rem; font-size: 0.9rem; color: #64748b; font-weight: 500; }
    .auth-link a { color: #0891b2; text-decoration: none; font-weight: 600; transition: color 0.2s; }
    .auth-link a:hover { color: #0e7490; text-decoration: underline; }

    /* Alerts */
    .alert { padding: 0.8rem 1rem; border-radius: 10px; font-size: 0.85rem; font-weight: 500; margin-bottom: 1.5rem; text-align: center; }
    .error-msg { background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5; }
    .success-msg { background: #d1fae5; color: #065f46; border: 1px solid #6ee7b7; }

    /* =========================================================
       RESPONSIVENESS
       ========================================================= */
    @media (max-width: 950px) {
      .hero-side { display: none; } 
      .form-side { max-width: 100%; background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); padding: 1.5rem; }
      .login-card { padding: 2.5rem 2rem; box-shadow: 0 15px 35px rgba(0,0,0,0.1); }
      .mobile-brand { display: flex; }
    }

    @media (max-width: 600px) {
      .form-grid { grid-template-columns: 1fr; gap: 0; }
    }

    @media (max-width: 380px) {
      .form-side { padding: 1rem; }
      .login-card { padding: 1.5rem 1rem; border-radius: 16px; }
      .mobile-brand { margin-bottom: 1.5rem; }
      .card-header h3 { font-size: 1.25rem; }
      .input-wrapper input, .input-wrapper select { padding-top: 0.75rem; padding-bottom: 0.75rem; font-size: 0.85rem; }
      .btn-login { padding: 0.75rem; font-size: 0.9rem; }
    }
  `]
})
export class RegisterComponent {
  // Matches exact Swagger Body
  form = {
    username: '',
    phone: '',
    role: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  loading = false;
  showPwd = false;
  errorMsg = '';
  successMsg = '';

  constructor(private auth: AuthService, private router: Router) {}

  register() {
    this.errorMsg = '';
    this.successMsg = '';

    // Basic Validation
    if (!this.form.username || !this.form.phone || !this.form.email || !this.form.role || !this.form.password) {
      this.errorMsg = 'Please fill in all required fields.';
      return;
    }

    // Password Match Validation
    if (this.form.password !== this.form.confirmPassword) {
      this.errorMsg = 'Passwords do not match.';
      return;
    }

    this.loading = true;

    this.auth.register(this.form).subscribe({
   
      next: () => {
        this.loading = false;
        this.successMsg = 'Registration successful! Redirecting to login...';
        
        // Clear form
        this.form = { username: '', phone: '', role: '', email: '', password: '', confirmPassword: '' };
        
        // Redirect after a short delay
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: (err: any) => { // Adding ': any' here just in case strict mode flags 'err' next!
        this.loading = false;
        // Handle API error message if provided, else fallback
        this.errorMsg = err.error?.message || err.error || 'Failed to register. Please check details or try another username.';
      }
    
    });
  }
}