import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="toast-container">
      <div *ngFor="let t of toasts" class="toast" [class]="'toast-'+t.type">{{ t.msg }}</div>
    </div>

    <div class="ph">
      <div><div class="pt">👤 My Profile</div><div class="ps">Manage your account details</div></div>
    </div>

    <div class="profile-grid">

      <!-- Profile Info Card -->
      <div class="card">
        <div class="card-title">📋 Personal Information</div>

        <div class="avatar-section">
          <div class="big-avatar">
  {{ name ? name.charAt(0).toUpperCase() : '?' }}
</div>
          <div class="avatar-info">
            <div class="av-name">{{ name }}</div>
            <div class="av-role">{{ role }}</div>
          </div>
        </div>

        <form (ngSubmit)="updateProfile()">
          <div class="fg">
            <label>Full Name</label>
            <input type="text" [(ngModel)]="name" name="name" placeholder="Your name" required />
          </div>
          <div class="fg">
            <label>Email Address</label>
            <input type="email" [(ngModel)]="email" name="email" placeholder="Your email" required />
          </div>
          <div class="fg">
            <label>Phone Number</label>
            <input type="tel" [(ngModel)]="phone" name="phone" placeholder="Your phone" required />
          </div>
          <button type="submit" class="btn btn-primary" [disabled]="saving">
            {{ saving ? '⏳ Saving...' : '💾 Update Profile' }}
          </button>
        </form>
      </div>

      <!-- Change Password Card -->
      <div class="card">
        <div class="card-title">🔒 Change Password</div>

        <form (ngSubmit)="changePassword()">
          <div class="fg">
            <label>Current Password</label>
            <div class="pw-wrap">
              <input [type]="showOld ? 'text' : 'password'"
                     [(ngModel)]="oldPassword" name="oldPwd"
                     placeholder="Enter current password" required />
              <span class="eye" (click)="showOld=!showOld">{{ showOld ? '🙈' : '👁️' }}</span>
            </div>
          </div>
          <div class="fg">
            <label>New Password</label>
            <div class="pw-wrap">
              <input [type]="showNew ? 'text' : 'password'"
                     [(ngModel)]="newPassword" name="newPwd"
                     placeholder="Enter new password" required />
              <span class="eye" (click)="showNew=!showNew">{{ showNew ? '🙈' : '👁️' }}</span>
            </div>
          </div>
          <div class="fg">
            <label>Confirm New Password</label>
            <div class="pw-wrap">
              <input [type]="showConfirm ? 'text' : 'password'"
                     [(ngModel)]="confirmPassword" name="confirmPwd"
                     placeholder="Confirm new password" required />
              <span class="eye" (click)="showConfirm=!showConfirm">{{ showConfirm ? '🙈' : '👁️' }}</span>
            </div>
          </div>

          <!-- Password strength -->
          <div class="strength-bar" *ngIf="newPassword">
            <div class="strength-fill"
                 [style.width]="strengthPercent + '%'"
                 [style.background]="strengthColor">
            </div>
          </div>
          <div class="strength-label" *ngIf="newPassword" [style.color]="strengthColor">
            {{ strengthLabel }}
          </div>

          <button type="submit" class="btn btn-warning" [disabled]="changingPwd">
            {{ changingPwd ? '⏳ Changing...' : '🔑 Change Password' }}
          </button>
        </form>
      </div>

    </div>
  `,
  styles: [`
    .ph { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1.5rem; }
    .pt { font-family:'Poppins',sans-serif; font-size:1.35rem; font-weight:700; }
    .ps { color:#64748b; font-size:.83rem; }

    .profile-grid { display:grid; grid-template-columns:1fr 1fr; gap:1.5rem; }

    .card { background:#fff; border-radius:14px; padding:1.75rem; box-shadow:0 1px 3px rgba(0,0,0,.07); }
    .card-title { font-family:'Poppins',sans-serif; font-weight:700; font-size:1rem; margin-bottom:1.5rem; color:#1e293b; }

    .avatar-section { display:flex; align-items:center; gap:1rem; margin-bottom:1.5rem; background:#f0f9ff; border-radius:12px; padding:1rem; }
    .big-avatar { width:56px; height:56px; background:#0891b2; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:1.5rem; font-weight:800; color:#fff; flex-shrink:0; }
    .av-name { font-weight:700; font-size:1rem; }
    .av-role { font-size:.8rem; color:#64748b; margin-top:2px; }

    .fg { margin-bottom:1rem; }
    .fg label { display:block; font-weight:700; font-size:.78rem; color:#64748b; margin-bottom:.35rem; }
    .fg input { width:100%; padding:.6rem .9rem; border:1.5px solid #e2e8f0; border-radius:8px; font-size:.9rem; outline:none; }
    .fg input:focus { border-color:#0891b2; }

    .pw-wrap { position:relative; }
    .pw-wrap input { padding-right:2.5rem; }
    .eye { position:absolute; right:.75rem; top:50%; transform:translateY(-50%); cursor:pointer; font-size:.9rem; }

    .strength-bar { height:6px; background:#e2e8f0; border-radius:3px; margin:.5rem 0 .25rem; overflow:hidden; }
    .strength-fill { height:100%; border-radius:3px; transition:width .3s, background .3s; }
    .strength-label { font-size:.75rem; font-weight:700; margin-bottom:1rem; }

    .btn { display:inline-flex; align-items:center; justify-content:center; gap:.35rem; width:100%; padding:.7rem; border-radius:9px; border:none; cursor:pointer; font-weight:700; font-size:.9rem; margin-top:.5rem; transition:all .2s; }
    .btn:disabled { opacity:.6; cursor:not-allowed; }
    .btn-primary { background:#0891b2; color:#fff; }
    .btn-primary:hover { background:#0e7490; }
    .btn-warning { background:#f59e0b; color:#fff; }
    .btn-warning:hover { background:#d97706; }

    .toast-container { position:fixed; top:1.5rem; right:1.5rem; z-index:2000; display:flex; flex-direction:column; gap:.5rem; }
    .toast { padding:.65rem 1.1rem; border-radius:9px; font-weight:700; font-size:.85rem; color:#fff; animation:slideIn .3s; }
    @keyframes slideIn { from { opacity:0; transform:translateX(20px) } to { opacity:1; transform:none } }
    .toast-success { background:#10b981; }
    .toast-error   { background:#ef4444; }

    @media(max-width:768px) { .profile-grid { grid-template-columns:1fr; } }
  `]
})
export class ProfileComponent implements OnInit {
 name: string | null = null;
  email   = '';
  phone   = '';
  role    = '';
  saving  = false;

  oldPassword     = '';
  newPassword     = '';
  confirmPassword = '';
  changingPwd     = false;
  showOld         = false;
  showNew         = false;
  showConfirm     = false;

  toasts: { msg: string; type: string }[] = [];

  get strengthPercent() {
    const p = this.newPassword;
    let score = 0;
    if (p.length >= 6)  score += 25;
    if (p.length >= 10) score += 25;
    if (/[A-Z]/.test(p)) score += 25;
    if (/[0-9!@#$%]/.test(p)) score += 25;
    return score;
  }

  get strengthColor() {
    const p = this.strengthPercent;
    if (p <= 25) return '#ef4444';
    if (p <= 50) return '#f59e0b';
    if (p <= 75) return '#0891b2';
    return '#10b981';
  }

  get strengthLabel() {
    const p = this.strengthPercent;
    if (p <= 25) return 'Weak';
    if (p <= 50) return 'Fair';
    if (p <= 75) return 'Good';
    return 'Strong ✅';
  }

  constructor(private http: HttpClient) {}

  ngOnInit() { this.loadProfile(); }

  loadProfile() {
    this.http.get<any>(`${environment.apiUrl}/User/profile`).subscribe({
      next: res => {
        this.name  = res.name;
        this.email = res.email;
        this.phone = res.phoneNumber;
        this.role  = res.role;
      },
      error: () => this.toast('Failed to load profile', 'error')
    });
  }

  updateProfile() {
    this.saving = true;
    this.http.put<any>(`${environment.apiUrl}/User/profile`, {
      name: this.name, email: this.email, phoneNumber: this.phone
    }).subscribe({
      next: () => { this.saving = false; this.toast('Profile updated!', 'success'); },
      error: err => { this.saving = false; this.toast(err.error?.message ?? 'Update failed', 'error'); }
    });
  }

  changePassword() {
    if (!this.oldPassword || !this.newPassword) { this.toast('Fill all fields', 'error'); return; }
    if (this.newPassword !== this.confirmPassword) { this.toast('Passwords do not match', 'error'); return; }
    if (this.newPassword.length < 6) { this.toast('Min 6 characters', 'error'); return; }

    this.changingPwd = true;
    this.http.put<any>(`${environment.apiUrl}/User/change-password`, {
      oldPassword: this.oldPassword,
      newPassword: this.newPassword
    }).subscribe({
      next: () => {
        this.changingPwd    = false;
        this.oldPassword    = '';
        this.newPassword    = '';
        this.confirmPassword = '';
        this.toast('Password changed!', 'success');
      },
      error: err => { this.changingPwd = false; this.toast(err.error?.message ?? 'Failed', 'error'); }
    });
  }

  toast(msg: string, type: string) {
    const t = { msg, type };
    this.toasts.push(t);
    setTimeout(() => this.toasts.splice(this.toasts.indexOf(t), 1), 3000);
  }
  
}