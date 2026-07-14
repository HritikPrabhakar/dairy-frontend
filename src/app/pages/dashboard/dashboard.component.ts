import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';

interface Dashboard {
  totalCustomers: number;
  activeCustomers: number;
  todayRevenue: number;
  monthRevenue: number;
  todayPaid: number;
  todayUnpaid: number;
  pendingBills: number;
  topProducts: { productName: string; totalQuantity: number; unit: string }[];
  recentBills: { billId: number; customerName: string; amount: number; isPaid: boolean; billMonth: string }[];
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="dashboard-container">
      <header class="ph">
        <div>
          <a routerLink="/" class="pt brand-link">📊 Dashboard</a>
          <div class="ps">Welcome back! Here's today's overview.</div>
        </div>
        <button class="btn-refresh" (click)="load()" [disabled]="loading">
          <span [class.spin]="loading">🔄</span> Refresh
        </button>
      </header>

      <div *ngIf="loading && !data" class="loading">⏳ Loading dashboard data...</div>
      <div *ngIf="error" class="error-msg">❌ {{ error }}</div>

      <ng-container *ngIf="data">
        <div class="stats">
          <div class="stat border-cyan">
            <div class="sico bg-cyan-light">👥</div>
            <div class="s-info"><div class="sv">{{ data.totalCustomers }}</div><div class="sl">Customers</div></div>
          </div>
          <div class="stat border-emerald">
            <div class="sico bg-emerald-light">✅</div>
            <div class="s-info"><div class="sv text-emerald">{{ data.activeCustomers }}</div><div class="sl">Active</div></div>
          </div>
          <div class="stat border-amber">
            <div class="sico bg-amber-light">💰</div>
            <div class="s-info"><div class="sv text-cyan-dark">₹{{ getTodayTotal() | number:'1.0-0' }}</div><div class="sl">Today Rev.</div></div>
          </div>
          
          <div class="stat" style="border-color:#8b5cf6">
            <div class="sico" style="background:#ede9fe">📅</div>
            <div>
              <div class="sv" style="color:#7c3aed">₹{{ monthRevenue | number:'1.0-0' }}</div>
              <div class="sl">Month Revenue</div>
            </div>
          </div>
          
          <div class="stat border-emerald">
            <div class="sico bg-emerald-light">🟢</div>
            <div class="s-info"><div class="sv text-emerald">{{ getTodayPaid() }}</div><div class="sl">Today Paid</div></div>
          </div>
          <div class="stat border-red">
            <div class="sico bg-red-light">🔴</div>
            <div class="s-info"><div class="sv text-red">{{ getTodayUnpaid() }}</div><div class="sl">Today Unpaid</div></div>
          </div>
          <div class="stat border-amber">
            <div class="sico bg-amber-light">🧾</div>
            <div class="s-info"><div class="sv text-amber-dark">{{ data.pendingBills }}</div><div class="sl">Pending Bills</div></div>
          </div>
        </div>

        <div class="grid2 mt">
          <div class="card">
            <div class="ct">🥇 Top Products This Month</div>
            <div *ngIf="!data.topProducts?.length" class="empty">No data yet</div>
            <div class="table-wrap" *ngIf="data.topProducts?.length">
              <table>
                <thead><tr><th>#</th><th>Product</th><th>Qty</th><th>Unit</th></tr></thead>
                <tbody>
                  <tr *ngFor="let p of data.topProducts; let i=index">
                    <td><span class="rank">{{ i+1 }}</span></td>
                    <td><strong>{{ p.productName }}</strong></td>
                    <td>{{ p.totalQuantity | number:'1.2-2' }}</td>
                    <td><span class="badge bi">{{ p.unit }}</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="card">
            <div class="ct-row">
              <span class="ct m-0">🧾 Recent Bills</span>
              <a routerLink="/bills" class="btn-link">View All →</a>
            </div>
            <div *ngIf="!data.recentBills?.length" class="empty">No bills yet</div>
            <div class="table-wrap" *ngIf="data.recentBills?.length">
              <table>
                <thead><tr><th>Customer</th><th>Month</th><th>Amount</th><th>Status</th></tr></thead>
                <tbody>
                  <tr *ngFor="let b of data.recentBills">
                    <td><strong>{{ b.customerName }}</strong></td>
                    <td>{{ b.billMonth | date:'MMM yyyy' }}</td>
                    <td>₹{{ b.amount | number:'1.0-0' }}</td>
                    <td><span class="badge" [class.bs]="b.isPaid" [class.bd]="!b.isPaid">{{ b.isPaid ? 'Paid' : 'Pending' }}</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="card mt hover-lift">
          <div class="ct">⚡ Quick Actions</div>
          <div class="actions">
            <a routerLink="/daily-report" class="action">📋 Daily Sales</a>
            <a routerLink="/customers"    class="action">➕ Add Customer</a>
            <a routerLink="/products"     class="action">➕ Add Product</a>
            <a routerLink="/bills"        class="action">🧾 Generate Bill</a>
            <button class="action action-btn" (click)="openQuickSale()">🛒 Quick Sale</button>
          </div>
        </div>

        <div class="card mt">
          <div class="ct-row">
            <span class="ct m-0">🛒 Today's Sales</span>
            <div class="summary-pills" *ngIf="todaySales.length > 0">
              <span class="pill pill-b">{{ todaySales.length }} Sales</span>
              <span class="pill pill-p">₹{{ getTodayTotal() | number:'1.0-0' }}</span>
              <span class="pill pill-g">{{ getTodayPaid() }} Paid</span>
              <span class="pill pill-r">{{ getTodayUnpaid() }} Unpaid</span>
            </div>
          </div>

          <div *ngIf="todaySales.length === 0" class="empty">No sales today yet. Use Quick Sale to add one.</div>
          
          <div class="table-wrap mt-half" *ngIf="todaySales.length > 0">
            <table>
              <thead>
                <tr>
                  <th>#</th><th>Customer</th><th>Products</th><th>Total</th><th>Status</th><th>Time</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let s of todaySales; let i=index">
                  <td>{{ i+1 }}</td>
                  <td>
                    <div class="cname">{{ s.customer?.name }}</div>
                    <div class="csub">{{ s.customer?.phone }}</div>
                  </td>
                  <td>
                    <div *ngFor="let item of s.items" class="product-line">
                      <strong>{{ item.product?.name }}</strong>
                      <span class="badge bi">{{ item.quantity }} {{ item.product?.unit == 1 ? 'L' : 'Kg' }}</span>
                      <span class="rate-txt">&#64; ₹{{ item.rate }}</span>
                    </div>
                  </td>
                  <td><strong class="amount">₹{{ s.totalAmount | number:'1.0-0' }}</strong></td>
                  <td><span class="badge" [class.bs]="s.isPaid" [class.bd]="!s.isPaid">{{ s.isPaid ? 'Paid' : 'Pending' }}</span></td>
                  <!-- 🔥 FIX: Changed s.createdAt back to s.saleDate with proper IST formatting -->
                  <td class="time-col">{{ s.saleDate | date:'shortTime':'+0530' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </ng-container>
    </div>

    <div class="overlay" *ngIf="showQuickSale" (click)="closeQuickSale()">
      <div class="quick-modal" (click)="closeDropdown(); $event.stopPropagation()">
        <div class="modal-head">
          <h3>🛒 Quick Sale</h3>
          <button class="close-btn" (click)="closeQuickSale()">✕</button>
        </div>

        <div class="modal-body">
          
          <div class="form-group">
            <label>Customer Selection</label>
            <div class="custom-select-container" (click)="$event.stopPropagation()">
              
              <div class="custom-select-trigger" (click)="toggleCustomerDropdown($event)">
                <span *ngIf="!selectedCustomer" class="placeholder">Select Customer...</span>
                <span *ngIf="selectedCustomer" class="selected-text">
                  <strong>{{ selectedCustomer.name }}</strong> 
                  <span class="text-muted">({{ selectedCustomer.address || 'No Address' }})</span>
                </span>
                <span class="arrow" [class.up]="customerDropdownOpen">▼</span>
              </div>

              <div class="custom-select-dropdown" *ngIf="customerDropdownOpen">
                <div class="search-box-wrapper">
                  <input type="text" 
                         placeholder="🔍 Search name or address..." 
                         [(ngModel)]="customerSearchTerm" 
                         (ngModelChange)="filterCustomers()"
                         (click)="$event.stopPropagation()"
                         class="dropdown-search-input" />
                </div>
                
                <div class="dropdown-list">
                  <div class="dropdown-item" 
                       *ngFor="let c of filteredCustomers" 
                       (click)="selectCustomer(c)">
                    <div class="c-name">{{ c.name }}</div>
                    <div class="c-sub">{{ c.address || 'No Address' }}</div>
                  </div>
                  <div class="dropdown-empty" *ngIf="filteredCustomers.length === 0">
                    No customers found.
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div class="form-group">
            <label>Products</label>
            <div class="product-row" *ngFor="let item of sale.items; let i=index">
              <select [(ngModel)]="item.productId">
                <option [ngValue]="0">Select Product...</option>
                <option *ngFor="let p of products" [ngValue]="p.id">{{ p.name }}</option>
              </select>
              <input type="number" min="0.1" step="0.1" placeholder="Qty" [(ngModel)]="item.quantity" />
              <button type="button" class="btn-remove" title="Remove" (click)="removeProduct(i)">✕</button>
            </div>
            <button type="button" class="btn-add" (click)="addProduct()">+ Add Product</button>
          </div>

          <div class="form-group">
            <label>Payment Status</label>
            <div class="radio-row">
              <label class="radio-label"><input type="radio" name="payment" [value]="true"  [(ngModel)]="sale.isPaid"> <span class="badge bs">Paid</span></label>
              <label class="radio-label"><input type="radio" name="payment" [value]="false" [(ngModel)]="sale.isPaid"> <span class="badge bd">Unpaid</span></label>
            </div>
          </div>

          <div *ngIf="saleError" class="alert error-msg">❌ {{ saleError }}</div>
          <div *ngIf="saleSuccess" class="alert success-msg">✅ Sale saved successfully!</div>
        </div>

        <div class="footer-btns">
          <button class="cancel-btn" (click)="closeQuickSale()">Cancel</button>
          <button class="save-btn" (click)="saveQuickSale()" [disabled]="saleSaving">
            {{ saleSaving ? 'Saving...' : 'Save Sale' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; font-family: 'Inter', 'Poppins', system-ui, -apple-system, sans-serif; color: #334155; background: #f8fafc; min-height: 100vh; padding: 1rem; }
    * { box-sizing: border-box; }
    .dashboard-container { max-width: 1400px; margin: 0 auto; }
    .mt { margin-top: 1.25rem; } .mt-half { margin-top: 0.75rem; } .m-0 { margin: 0 !important; }

    .ph { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; gap: 0.5rem; flex-wrap: wrap; }
    .brand-link { font-family: 'Poppins', sans-serif; font-size: 1.3rem; font-weight: 800; color: #0f172a; text-decoration: none; transition: color 0.2s, transform 0.2s; }
    .brand-link:hover { color: #0891b2; transform: translateY(-1px); }
    .ps { color: #64748b; font-size: 0.85rem; margin-top: 2px; }
    .btn-refresh { background: #0891b2; color: #fff; border: none; padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 2px 4px rgba(8,145,178,0.2); }
    .btn-refresh:hover:not(:disabled) { background: #0e7490; transform: translateY(-1px); }
    .spin { display: inline-block; animation: spin 1s linear infinite; }
    @keyframes spin { 100% { transform: rotate(360deg); } }

    .loading { text-align: center; padding: 3rem; color: #64748b; font-weight: 500; }
    .alert { padding: 0.8rem 1rem; border-radius: 8px; font-size: 0.85rem; font-weight: 500; margin-bottom: 1rem; }
    .error-msg { background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5; }
    .success-msg { background: #d1fae5; color: #065f46; border: 1px solid #6ee7b7; }

    .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin-bottom: 1.5rem; }
    .stat { background: #fff; border-radius: 12px; padding: 1rem; display: flex; align-items: center; gap: 0.8rem; border-left: 4px solid #cbd5e1; box-shadow: 0 2px 6px rgba(0,0,0,0.04); transition: transform 0.2s, box-shadow 0.2s; }
    .stat:hover { transform: translateY(-3px); box-shadow: 0 6px 12px rgba(0,0,0,0.08); }
    .sico { font-size: 1.3rem; width: 42px; height: 42px; display: flex; align-items: center; justify-content: center; border-radius: 10px; flex-shrink: 0; }
    .s-info { flex-grow: 1; min-width: 0; }
    .sv { font-size: 1.25rem; font-weight: 800; font-family: 'Poppins', sans-serif; line-height: 1.2; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .sl { font-size: 0.75rem; color: #64748b; font-weight: 600; margin-top: 2px; text-transform: uppercase; letter-spacing: 0.5px; }

    .border-cyan { border-color: #0891b2; } .bg-cyan-light { background: #e0f2fe; } .text-cyan-dark { color: #0e7490; }
    .border-emerald { border-color: #10b981; } .bg-emerald-light { background: #d1fae5; } .text-emerald { color: #10b981; }
    .border-amber { border-color: #f59e0b; } .bg-amber-light { background: #fef3c7; } .text-amber-dark { color: #d97706; }
    .border-red { border-color: #ef4444; } .bg-red-light { background: #fee2e2; } .text-red { color: #ef4444; }

    .card { background: #fff; border-radius: 12px; padding: 1.25rem; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
    .hover-lift { transition: transform 0.2s, box-shadow 0.2s; }
    .hover-lift:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(0,0,0,0.06); }
    .ct { font-family: 'Poppins', sans-serif; font-weight: 700; font-size: 1rem; color: #1e293b; margin-bottom: 1rem; }
    .ct-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.75rem; }
    .btn-link { font-size: 0.8rem; color: #0891b2; text-decoration: none; font-weight: 700; background: #f0f9ff; padding: 0.3rem 0.8rem; border-radius: 6px; }
    .grid2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.25rem; }

    .table-wrap { overflow-x: auto; border-radius: 8px; border: 1px solid #f1f5f9; }
    table { width: 100%; border-collapse: collapse; min-width: 380px; text-align: left; }
    th { padding: 0.75rem 1rem; font-size: 0.75rem; font-weight: 700; color: #64748b; background: #f8fafc; text-transform: uppercase; border-bottom: 1px solid #e2e8f0; }
    td { padding: 0.75rem 1rem; border-bottom: 1px solid #f1f5f9; font-size: 0.85rem; vertical-align: middle; }
    tr:hover td { background: #f8fafc; }
    .rank { display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; background: #e0f2fe; color: #0e7490; border-radius: 50%; font-size: 0.75rem; font-weight: 700; }
    .badge { display: inline-block; padding: 0.2rem 0.6rem; border-radius: 12px; font-size: 0.7rem; font-weight: 700; }
    .bi { background: #e0f2fe; color: #0369a1; } .bs { background: #d1fae5; color: #065f46; } .bd { background: #fee2e2; color: #991b1b; }
    .empty { color: #94a3b8; text-align: center; padding: 2rem; font-style: italic; background: #f8fafc; border-radius: 8px; }

    .actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }
    .action { flex: 1 1 auto; text-align: center; background: #f0f9ff; color: #0e7490; padding: 0.7rem 1rem; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 0.85rem; transition: all 0.2s; cursor: pointer; }
    .action:hover { background: #0891b2; color: #fff; transform: translateY(-2px); }
    .action-btn { border: none; font-family: inherit; }

    .summary-pills { display: flex; gap: 0.5rem; flex-wrap: wrap; }
    .pill { padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.75rem; font-weight: 700; }
    .pill-b { background: #e0f2fe; color: #0369a1; } .pill-g { background: #d1fae5; color: #065f46; } .pill-r { background: #fee2e2; color: #991b1b; } .pill-p { background: #f3e8ff; color: #6b21a8; }
    .cname { font-weight: 700; font-size: 0.9rem; } .csub { font-size: 0.75rem; color: #64748b; }
    .product-line { display: flex; align-items: center; gap: 0.4rem; margin-bottom: 0.3rem; font-size: 0.8rem; }
    .rate-txt { color: #64748b; font-size: 0.75rem; background: #f1f5f9; padding: 2px 6px; border-radius: 4px; }
    .time-txt { font-size: 0.8rem; color: #475569; font-weight: 600; white-space: nowrap; }

    /* ============================================================
       CUSTOM SEARCHABLE DROPDOWN STYLES
       ============================================================ */
    .custom-select-container { position: relative; width: 100%; }
    
    .custom-select-trigger { 
      width: 100%; padding: 0.6rem 0.8rem; border: 1px solid #cbd5e1; border-radius: 8px; 
      font-size: 0.9rem; font-family: inherit; color: #0f172a; background: #fff;
      display: flex; justify-content: space-between; align-items: center; cursor: pointer;
      transition: all 0.2s; 
    }
    .custom-select-trigger:hover { border-color: #94a3b8; }
    .custom-select-trigger .placeholder { color: #94a3b8; }
    .custom-select-trigger .selected-text { font-size: 0.9rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .custom-select-trigger .arrow { font-size: 0.7rem; color: #64748b; transition: transform 0.2s; }
    .custom-select-trigger .arrow.up { transform: rotate(180deg); }
    .text-muted { color: #64748b; font-size: 0.8rem; margin-left: 6px; }

    .custom-select-dropdown { 
      position: absolute; top: 100%; left: 0; right: 0; background: #fff; 
      border: 1px solid #cbd5e1; border-radius: 8px; margin-top: 4px; 
      box-shadow: 0 10px 25px -5px rgba(0,0,0,0.15); z-index: 100; overflow: hidden;
      display: flex; flex-direction: column;
    }
    
    .search-box-wrapper { padding: 8px; border-bottom: 1px solid #f1f5f9; background: #f8fafc; }
    .dropdown-search-input { 
      width: 100%; padding: 0.5rem; border: 1px solid #e2e8f0; border-radius: 6px; 
      font-size: 0.85rem; outline: none; transition: border-color 0.2s;
    }
    .dropdown-search-input:focus { border-color: #0891b2; }

    .dropdown-list { max-height: 220px; overflow-y: auto; }
    .dropdown-item { padding: 0.6rem 0.8rem; cursor: pointer; border-bottom: 1px solid #f8fafc; }
    .dropdown-item:last-child { border-bottom: none; }
    .dropdown-item:hover { background: #f0f9ff; }
    .dropdown-item .c-name { font-weight: 600; font-size: 0.85rem; color: #0f172a; }
    .dropdown-item .c-sub { font-size: 0.75rem; color: #64748b; margin-top: 2px;}
    .dropdown-empty { padding: 1rem; text-align: center; font-size: 0.85rem; color: #94a3b8; font-style: italic; }

    /* ------------------------------------------------------------ */

    .overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.6); backdrop-filter: blur(2px); display: flex; justify-content: center; align-items: center; z-index: 9999; padding: 1rem; }
    .quick-modal { width: 100%; max-width: 520px; background: #fff; border-radius: 16px; display: flex; flex-direction: column; max-height: 92vh; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); }
    .modal-head { display: flex; justify-content: space-between; align-items: center; padding: 1.25rem; border-bottom: 1px solid #f1f5f9; }
    .modal-head h3 { margin: 0; font-family: 'Poppins', sans-serif; font-size: 1.1rem; color: #0f172a; }
    .close-btn { border: none; background: #f1f5f9; border-radius: 50%; width: 32px; height: 32px; font-size: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
    .close-btn:hover { background: #fee2e2; color: #ef4444; }
    
    .modal-body { padding: 1.25rem; overflow-y: visible; flex-grow: 1; }
    .form-group { margin-bottom: 1.15rem; }
    .form-group label { display: block; margin-bottom: 6px; font-weight: 600; font-size: 0.85rem; color: #475569; }
    .form-group select, .form-group input[type="number"] { width: 100%; padding: 0.6rem 0.8rem; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.9rem; font-family: inherit; }
    .form-group select:focus, .form-group input[type="number"]:focus { outline: none; border-color: #0891b2; box-shadow: 0 0 0 3px rgba(8,145,178,0.1); }
    
    .product-row { display: grid; grid-template-columns: 1fr 80px auto; gap: 8px; align-items: center; margin-bottom: 8px; }
    .btn-remove { background: #fee2e2; color: #ef4444; border: none; width: 36px; height: 36px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
    .btn-remove:hover { background: #ef4444; color: #fff; }
    .btn-add { background: #f0fdf4; color: #10b981; border: 1px dashed #10b981; padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer; font-size: 0.85rem; font-weight: 600; width: 100%; margin-top: 4px; }
    
    .radio-row { display: flex; gap: 1.5rem; }
    .radio-label { display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 0.9rem; }
    
    .footer-btns { display: flex; justify-content: flex-end; gap: 12px; padding: 1.25rem; border-top: 1px solid #f1f5f9; background: #f8fafc; border-radius: 0 0 16px 16px; }
    .cancel-btn { padding: 0.6rem 1.2rem; border: 1px solid #cbd5e1; background: #fff; color: #475569; border-radius: 8px; cursor: pointer; font-size: 0.9rem; }
    .cancel-btn:hover { background: #f1f5f9; }
    .save-btn { padding: 0.6rem 1.5rem; background: #0891b2; color: #fff; border: none; border-radius: 8px; cursor: pointer; font-size: 0.9rem; font-weight: 600; box-shadow: 0 2px 4px rgba(8,145,178,0.2); }
    .save-btn:hover:not(:disabled) { background: #0e7490; transform: translateY(-1px); }
    .save-btn:disabled { opacity: 0.6; cursor: not-allowed; }
/* Quick Sale Modal - same scroll behavior as Edit Modal */
.quick-modal { 
  background: #fff; 
  border-radius: 16px; 
  width: 100%; 
  max-width: 520px; 
  max-height: 90vh; 
  display: flex; 
  flex-direction: column; 
  box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); 
}

.quick-modal .modal-body { 
  overflow-y: auto; 
  flex-grow: 1; 
  -webkit-overflow-scrolling: touch; 
}
    @media (max-width: 640px) {
      :host { padding: 0.5rem; }
      .stats { grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 0.5rem; }
      .product-row { grid-template-columns: 1fr; background: #f8fafc; padding: 8px; border-radius: 8px; }
      .btn-remove { width: 100%; margin-top: 4px; }
      .time-txt {
        white-space: nowrap !important;
        font-size: 0.75rem !important;
      }
    }
    @media (max-width: 600px) {
  .quick-modal { max-height: 85vh; }
}
  `]
})
export class DashboardComponent implements OnInit {
  data: Dashboard | null = null;
  loading = false;
  error = '';

  showQuickSale = false;
  saleSaving = false;
  saleError = '';
  saleSuccess = false;
  monthRevenue = 0;
  todayRevenue = 0;

  allCustomers: any[] = [];           
  filteredCustomers: any[] = [];
  customerSearchTerm = '';            
  selectedCustomer: any = null;
  customerDropdownOpen = false;

  products: any[] = [];
  todaySales: any[] = [];

  sale = {
    customerId: 0,
    isPaid: false,
    items: [{ productId: 0, quantity: 1 }]
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.load();
    this.loadCustomers(); 
    this.loadProducts();
    this.loadTodaySales();
    this.loadRevenue(); 
  }

  loadRevenue() {
    const now = new Date();
    const year  = now.getFullYear();
    const month = now.getMonth() + 1;

    this.http.get<any>(`${environment.apiUrl}/DailySale/revenue/monthly?year=${year}&month=${month}`)
      .subscribe({ next: r => this.monthRevenue = r.totalRevenue });

    this.http.get<any>(`${environment.apiUrl}/DailySale/revenue/today`)
      .subscribe({ next: r => this.todayRevenue = r.totalRevenue });
  }

  load() {
    this.loading = true;
    this.error = '';
    this.http.get<Dashboard>(`${environment.apiUrl}/Dashboard`).subscribe({
      next: (d) => { this.data = d; this.loading = false; },
      error: (e) => { this.error = 'Failed to load dashboard.'; this.loading = false; console.error(e); }
    });
  }

  loadCustomers() {
  this.http
    .get<any>(`${environment.apiUrl}/Customer?page=1&pageSize=1000`)
    .subscribe({
      next: (res) => {
        this.allCustomers = res.data || [];
        this.filteredCustomers = [...this.allCustomers];
      },
      error: (err) => {
        console.error('Failed to load customers', err);
        this.allCustomers = [];
        this.filteredCustomers = [];
      }
    });
}

  loadProducts() {
    this.http.get<any[]>(`${environment.apiUrl}/Product`).subscribe({
      next: (res) => { this.products = res; }
    });
  }

  loadTodaySales() {
    this.http.get<any[]>(`${environment.apiUrl}/DailySale`).subscribe({
      next: (res) => { this.todaySales = res; }
    });
  }

  getTodayTotal(): number { return this.todaySales.reduce((sum, sale) => sum + sale.totalAmount, 0); }
  getTodayPaid(): number { return this.todaySales.filter(sale => sale.isPaid).length; }
  getTodayUnpaid(): number { return this.todaySales.filter(sale => !sale.isPaid).length; }

  toggleCustomerDropdown(event: Event) {
    event.stopPropagation();
    this.customerDropdownOpen = !this.customerDropdownOpen;
    
    if (this.customerDropdownOpen) {
      this.customerSearchTerm = '';
      this.filteredCustomers = this.allCustomers;
    }
  }

  closeDropdown() {
    this.customerDropdownOpen = false;
  }

  filterCustomers() {
    if (!this.customerSearchTerm || !this.customerSearchTerm.trim()) {
      this.filteredCustomers = this.allCustomers;
      return;
    }
    const lowerTerm = this.customerSearchTerm.toLowerCase().trim();
    this.filteredCustomers = this.allCustomers.filter(c => 
      (c.name && c.name.toLowerCase().includes(lowerTerm)) ||
      (c.address && c.address.toLowerCase().includes(lowerTerm))
    );
  }

  selectCustomer(customer: any) {
    this.selectedCustomer = customer;
    this.sale.customerId = customer.id;
    this.closeDropdown(); 
  }

  openQuickSale() {
    this.selectedCustomer = null;
    this.closeDropdown();
    
    if(this.allCustomers.length === 0) {
       this.loadCustomers(); 
    }
    this.sale = { customerId: 0, isPaid: false, items: [{ productId: 0, quantity: 1 }] };
    this.saleError = '';
    this.saleSuccess = false;
    this.showQuickSale = true;
    document.body.style.overflow = 'hidden';
  }

  closeQuickSale() { 
    this.showQuickSale = false; 
    document.body.style.overflow = 'auto';
  }

  addProduct() { this.sale.items.push({ productId: 0, quantity: 1 }); }
  removeProduct(index: number) { if (this.sale.items.length > 1) this.sale.items.splice(index, 1); }

  saveQuickSale() {
    if (this.sale.customerId === 0) { 
      this.saleError = 'Please select a customer.'; 
      return; 
    }
    if (this.sale.items.some(i => i.productId === 0 || i.quantity < 0.1)) { 
      this.saleError = 'Please check items data entries.'; 
      return; 
    }

    this.saleSaving = true;
    this.saleError = '';
    this.saleSuccess = false;

    this.http.post(`${environment.apiUrl}/DailySale`, {
      customerId: this.sale.customerId,
      isPaid: this.sale.isPaid,
      items: this.sale.items
    }).subscribe({
      next: () => {
        this.saleSaving = false;
        this.saleSuccess = true;
        this.load();
        this.loadTodaySales();
        setTimeout(() => this.closeQuickSale(), 1200);
      },
      error: (e) => {
        this.saleSaving = false;
        this.saleError = 'Failed to process transaction.';
        console.error(e);
      }
    });
  }
}