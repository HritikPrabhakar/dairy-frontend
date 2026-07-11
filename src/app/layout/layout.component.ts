// 
import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <div class="shell">
      <div class="mobile-backdrop" *ngIf="mobileMenuOpen" (click)="closeMobileMenu()"></div>

      <aside class="sidebar" [class.collapsed]="collapsed" [class.mobile-open]="mobileMenuOpen">
        <div class="brand">
         
           <a routerLink="/" class="pt brand-link"> <span class="brand-icon">🥛</span></a>
          <span class="brand-name" *ngIf="!collapsed || mobileMenuOpen">DairyAdmin</span>
          <button class="close-mobile-btn" (click)="closeMobileMenu()">✕</button>
        </div>

        <nav class="nav">
          <a routerLink="/dashboard" routerLinkActive="active" class="nav-item" (click)="closeMobileMenu()">
            <span class="ni">📊</span><span class="n-text" *ngIf="!collapsed || mobileMenuOpen">Dashboard</span>
          </a>
          <a routerLink="/customers" routerLinkActive="active" class="nav-item" (click)="closeMobileMenu()">
            <span class="ni">👥</span><span class="n-text" *ngIf="!collapsed || mobileMenuOpen">Customers</span>
          </a>
          <a routerLink="/products" routerLinkActive="active" class="nav-item" (click)="closeMobileMenu()">
            <span class="ni">📦</span><span class="n-text" *ngIf="!collapsed || mobileMenuOpen">Products</span>
          </a>
          <a routerLink="/daily-report" routerLinkActive="active" class="nav-item" (click)="closeMobileMenu()">
            <span class="ni">📋</span><span class="n-text" *ngIf="!collapsed || mobileMenuOpen">Daily Sales</span>
          </a>
          <a routerLink="/bills" routerLinkActive="active" class="nav-item" (click)="closeMobileMenu()">
            <span class="ni">🧾</span><span class="n-text" *ngIf="!collapsed || mobileMenuOpen">Bills</span>
          </a>
        </nav>

      <div class="sidebar-foot">

  <div class="profile-area"
       (click)="goProfile()"
       style="display:flex;align-items:center;gap:10px;flex:1;cursor:pointer">

    <div class="avatar">{{ initial }}</div>

    <div class="user-info" *ngIf="!collapsed || mobileMenuOpen">
      <div class="uname">{{ user?.username || 'Admin' }}</div>
      <div class="urole">Administrator</div>
    </div>

  </div>

  <button
    type="button"
    class="logout-btn"
    (click)="auth.logout(); $event.stopPropagation()"
    title="Logout">
    🚪
  </button>

</div>
        
      </aside>

      <main class="main">
        <header class="topbar">
          <button class="btn-toggle desktop-only" (click)="collapsed = !collapsed" title="Toggle Sidebar">
            <span class="bar" [class.bar-collapsed]="collapsed"></span>
            <span class="bar"></span>
            <span class="bar" [class.bar-collapsed]="collapsed"></span>
          </button>
          
          <button class="btn-toggle mobile-only" (click)="mobileMenuOpen = true">
            ☰
          </button>

          <div class="topbar-right">
            <span class="date-pill">📅 <span class="date-text">{{ today | date:'EEE, dd MMM yyyy' }}</span></span>
          </div>
        </header>

        <div class="page-wrap">
          <router-outlet />
        </div>
      </main>
    </div>
  `,
  styles: [`
    /* Base Setup */
    :host { 
      display: block; 
      font-family: 'Inter', 'Poppins', system-ui, -apple-system, sans-serif;
    }
    * { box-sizing: border-box; }
    
    .shell { 
      display: flex; 
      height: 100vh; 
      overflow: hidden; 
      background: #f8fafc; /* Matches Dashboard background perfectly */
    }

    /* === Sidebar (Desktop Base) === */
    .sidebar { 
      width: 240px; 
      background: #0f172a; 
      display: flex; 
      flex-direction: column; 
      flex-shrink: 0; 
      transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1); 
      z-index: 40;
    }
    .sidebar.collapsed { width: 72px; }

    /* Brand Header */
    .brand { 
      display: flex; align-items: center; gap: 12px; 
      padding: 20px 16px; 
      border-bottom: 1px solid rgba(255,255,255,0.06); 
      height: 64px;
    }
    .brand-icon { font-size: 24px; line-height: 1; display: flex; align-items: center; justify-content: center; width: 32px; }
    .brand-name { font-family: 'Poppins', sans-serif; font-weight: 700; color: #fff; font-size: 1.1rem; letter-spacing: 0.5px; white-space: nowrap; overflow: hidden; }
    
    /* Navigation */
    .nav { flex: 1; padding: 16px 12px; display: flex; flex-direction: column; gap: 6px; overflow-y: auto; overflow-x: hidden; }
    .nav::-webkit-scrollbar { width: 4px; }
    .nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
    
    .nav-item { 
      display: flex; align-items: center; gap: 12px; 
      padding: 10px 12px; 
      border-radius: 10px; 
      color: #94a3b8; 
      text-decoration: none; 
      font-weight: 600; 
      font-size: 0.9rem; 
      transition: all 0.2s ease;
      white-space: nowrap;
    }
    .nav-item:hover { background: rgba(255,255,255,0.06); color: #fff; transform: translateX(2px); }
    .nav-item.active { background: #0891b2; color: #fff; box-shadow: 0 4px 12px rgba(8,145,178,0.3); }
    
    .ni { font-size: 1.1rem; min-width: 24px; text-align: center; display: flex; align-items: center; justify-content: center; }
    .n-text { opacity: 1; transition: opacity 0.2s; }
    
    /* Footer / User Profile */
    .sidebar-foot { 
      padding: 16px 12px; 
      border-top: 1px solid rgba(255,255,255,0.06); 
      display: flex; align-items: center; gap: 10px; 
      background: rgba(0,0,0,0.1);
    }
    .avatar { 
      width: 36px; height: 36px; 
      background: linear-gradient(135deg, #0891b2, #0284c7); 
      border-radius: 50%; 
      display: flex; align-items: center; justify-content: center; 
      font-weight: 700; color: #fff; font-size: 1rem; flex-shrink: 0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }
    .user-info { flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; }
    .uname { color: #f8fafc; font-size: 0.85rem; font-weight: 700; text-overflow: ellipsis; overflow: hidden; }
    .urole { color: #64748b; font-size: 0.75rem; font-weight: 500; }
    
    .logout-btn { 
      background: rgba(255,255,255,0.05); border: none; border-radius: 8px; 
      padding: 8px; cursor: pointer; font-size: 1.1rem; 
      margin-left: auto; transition: all 0.2s; display: flex; align-items: center; justify-content: center;
    }
    .logout-btn:hover { background: #fee2e2; color: #ef4444; }

    /* === Main Content Area === */
    .main { 
      flex: 1; 
      display: flex; 
      flex-direction: column; 
      overflow: hidden; 
      position: relative;
    }
    
    .topbar { 
      background: #fff; 
      padding: 0 1.5rem; 
      height: 64px; 
      display: flex; align-items: center; justify-content: space-between; 
      border-bottom: 1px solid #e2e8f0;
      box-shadow: 0 1px 2px rgba(0,0,0,0.02);
      z-index: 10;
    }

    /* Animated Menu Toggle Button */
    .btn-toggle { 
      background: #f1f5f9; border: none; border-radius: 8px; 
      width: 38px; height: 38px; 
      cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px;
      transition: background 0.2s; color: #0f172a; font-size: 1.2rem;
    }
    .btn-toggle:hover { background: #e2e8f0; }
    .bar { width: 18px; height: 2px; background-color: #475569; transition: 0.3s; border-radius: 2px; }
    .bar-collapsed:first-child { transform: translateY(2px) scaleX(0.7); }
    .bar-collapsed:last-child { transform: translateY(-2px) scaleX(0.7); }
    
    .date-pill { 
      background: #f0f9ff; color: #0e7490; 
      padding: 6px 14px; border-radius: 20px; 
      font-weight: 600; font-size: 0.85rem; 
      display: flex; align-items: center; gap: 6px;
      border: 1px solid #e0f2fe;
    }
    
    .page-wrap { 
      flex: 1; 
      overflow-y: auto; 
      -webkit-overflow-scrolling: touch;
      /* Padding applied in child components typically, but keeping a fallback here */
    }

    /* Utility Display Classes */
    .mobile-only { display: none; }
    .desktop-only { display: flex; }
    .close-mobile-btn { display: none; }
    .mobile-backdrop { display: none; }

    /* =========================================================
       RESPONSIVE DESIGN (Tablets, Phones, Galaxy Fold)
       ========================================================= */
       
    @media (max-width: 768px) {
      .desktop-only { display: none; }
      .mobile-only { display: flex; font-size: 1.2rem; line-height: 1; }
      
      .topbar { padding: 0 1rem; }
      .date-text { display: none; /* Hide date text on mobile, keep emoji */ }
      .date-pill { padding: 6px 10px; border-radius: 8px; }

      /* Backdrop Overlay */
      .mobile-backdrop {
        display: block;
        position: fixed;
        inset: 0;
        background: rgba(15,23,42,0.6);
        backdrop-filter: blur(2px);
        z-index: 45; /* Below sidebar, above main */
      }

      /* Sidebar turns into Off-Canvas Mobile Drawer */
      .sidebar {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        width: 260px !important; /* Fixed width on mobile */
        transform: translateX(-100%); /* Hidden by default */
        z-index: 50;
        box-shadow: 4px 0 15px rgba(0,0,0,0.2);
      }
      
      .sidebar.mobile-open {
        transform: translateX(0); /* Slide in */
      }

      /* Always show text and info when mobile drawer is open */
      .brand-name, .n-text, .user-info { display: block !important; }
      
      .close-mobile-btn {
        display: flex; align-items: center; justify-content: center;
        background: rgba(255,255,255,0.1); border: none; border-radius: 8px;
        color: #fff; width: 32px; height: 32px; margin-left: auto; cursor: pointer; font-size: 1rem;
      }
      .close-mobile-btn:hover { background: #fee2e2; color: #ef4444; }
    }

    /* Ultra narrow screens (Galaxy Fold outer screen ~280px) */
    @media (max-width: 360px) {
      .sidebar { width: 85% !important; max-width: 260px; }
      .brand-name { font-size: 1rem; }
    }
  `]
})
export class LayoutComponent {
  collapsed = false;
  mobileMenuOpen = false;
  today = new Date();
  user: any = null;

  constructor(
  public auth: AuthService,
  private router: Router
) {
  this.user = this.auth.getUser();
}

  get initial(): string {
    return this.user?.username?.[0]?.toUpperCase() ?? 'A';
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
  }
  goProfile() {
  this.closeMobileMenu();
  this.router.navigate(['/profile']);
}
}