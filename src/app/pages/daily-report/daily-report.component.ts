// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { HttpClient } from '@angular/common/http';
// import { environment } from '../../../environments/environment';

// @Component({
//   selector: 'app-daily-report',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   template: `
//     <div class="toast-container">
//       <div *ngFor="let t of toasts" class="toast" [class]="'toast-'+t.type">{{ t.msg }}</div>
//     </div>

//     <div class="ph">
//       <div><div class="pt">🛒 Daily Sales</div><div class="ps">View and manage daily quick sales</div></div>
//     </div>

//     <!-- Date Controls -->
//     <div class="card ctrl-bar">
//       <div class="date-nav">
//         <button class="btn btn-outline btn-sm" (click)="prevDay()">◀</button>
//         <input type="date" class="form-control date-input" [value]="dateStr" (change)="onDateChange($event)" />
//         <button class="btn btn-outline btn-sm" (click)="nextDay()">▶</button>
//         <button class="btn btn-primary btn-sm" (click)="goToday()">Today</button>
//       </div>
//       <div class="pills">
//         <span class="pill pill-b">{{ sales.length }} Sales</span>
//         <span class="pill pill-g">{{ paidCount }} Paid</span>
//         <span class="pill pill-r">{{ unpaidCount }} Unpaid</span>
//         <span class="pill pill-p">₹{{ totalRevenue | number:'1.0-0' }}</span>
//       </div>
//     </div>

//     <!-- Table -->
//     <div class="card">
//       <div *ngIf="loading" class="empty">⏳ Loading...</div>
//       <div *ngIf="!loading && sales.length===0" class="empty">No sales for this date.</div>
//       <div class="table-wrap" *ngIf="!loading && sales.length>0">
//         <table>
//           <thead>
//             <tr>
//               <th>#</th>
//               <th>Customer</th>
//               <th>Products</th>
//               <th>Total</th>
//               <th>Status</th>
//               <th>Time</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             <tr *ngFor="let s of sales; let i=index"
//                 [style.background]="s.isPaid ? '#f0fdf4' : '#fff7ed'">
//               <td>{{ i+1 }}</td>
//               <td>
//                 <div class="cname">{{ s.customer?.name }}</div>
//                 <div class="csub">{{ s.customer?.phone }}</div>
//               </td>
//               <td>
//                 <div *ngFor="let item of s.items" class="product-line">
//                   <span class="ptag">{{ item.product?.name }}</span>
//                   <span class="qty">{{ item.quantity }}{{ item.product?.unit == 1 ? 'L' : 'Kg' }}</span>
//                   <span class="rate">&#64;₹{{ item.rate }}</span>
//                 </div>
//               </td>
//               <td><strong class="amt">₹{{ s.totalAmount | number:'1.0-0' }}</strong></td>
//               <td>
//                 <span class="badge" [class.bs]="s.isPaid" [class.bd]="!s.isPaid">
//                   {{ s.isPaid ? 'Paid' : 'Pending' }}
//                 </span>
//               </td>
//               <td class="time-col">{{ s.saleDate | date:'hh:mm a' }}</td>
//               <td>
//                 <div class="abts">
//                   <button *ngIf="!s.isPaid" class="btn btn-sm btn-success" (click)="markPaid(s)">✅</button>
//                   <button class="btn btn-sm btn-outline" (click)="openEdit(s)">✏️</button>
//                   <button class="btn btn-sm btn-danger" (click)="deleteSale(s)">🗑️</button>
//                 </div>
//               </td>
//             </tr>
//           </tbody>
//         </table>
//       </div>
//     </div>

//     <!-- Edit Modal -->
//     <div class="overlay" *ngIf="editSale" (click)="closeEdit()">
//       <div class="modal" (click)="$event.stopPropagation()">
//         <div class="modal-head">
//           <h3>✏️ Edit — {{ editSale.customer?.name }}</h3>
//           <button class="close-btn" (click)="closeEdit()">✕</button>
//         </div>

//         <div class="form-group">
//           <label>Products</label>
//           <div class="product-row" *ngFor="let item of editItems; let i=index">
//             <select [(ngModel)]="item.productId">
//               <option [ngValue]="0">Select Product</option>
//               <option *ngFor="let p of products" [ngValue]="p.id">{{ p.name }}</option>
//             </select>
//             <input type="number" min="0.1" step="0.1" [(ngModel)]="item.quantity" />
//             <button type="button" class="btn-remove" (click)="removeEditItem(i)">✕</button>
//           </div>
//           <button type="button" class="btn-add" (click)="addEditItem()">+ Add</button>
//         </div>

//         <div class="form-group">
//           <label>Payment Status</label>
//           <div class="radio-row">
//             <label><input type="radio" name="epay" [value]="true"  [(ngModel)]="editIsPaid"> Paid</label>
//             <label><input type="radio" name="epay" [value]="false" [(ngModel)]="editIsPaid"> Unpaid</label>
//           </div>
//         </div>

//         <div class="form-group">
//           <label>Remarks</label>
//           <input type="text" [(ngModel)]="editRemarks" placeholder="Optional remarks" />
//         </div>

//         <div *ngIf="editError" class="sale-error">❌ {{ editError }}</div>

//         <div class="footer-btns">
//           <button class="cancel-btn" (click)="closeEdit()">Cancel</button>
//           <button class="save-btn" (click)="saveEdit()" [disabled]="editSaving">
//             {{ editSaving ? 'Saving...' : 'Save Changes' }}
//           </button>
//         </div>
//       </div>
//     </div>
//   `,
//   styles: [`
//     :host { display:block; }

//     .ph { display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; gap:.5rem; flex-wrap:wrap; }
//     .pt { font-family:'Poppins',sans-serif; font-size:1.2rem; font-weight:700; }
//     .ps { color:#64748b; font-size:.78rem; }

//     .card { background:#fff; border-radius:12px; padding:1rem; box-shadow:0 1px 3px rgba(0,0,0,.07); margin-bottom:1rem; }

//     .ctrl-bar { display:flex; flex-wrap:wrap; gap:.75rem; align-items:center; justify-content:space-between; }
//     .date-nav { display:flex; align-items:center; gap:.4rem; flex-wrap:wrap; }
//     .date-input { padding:.45rem .75rem; border:1.5px solid #e2e8f0; border-radius:8px; font-size:.85rem; outline:none; width:150px; }

//     .pills { display:flex; gap:.4rem; flex-wrap:wrap; }
//     .pill { padding:.2rem .6rem; border-radius:20px; font-size:.72rem; font-weight:700; }
//     .pill-g { background:#d1fae5; color:#065f46; }
//     .pill-r { background:#fee2e2; color:#991b1b; }
//     .pill-b { background:#dbeafe; color:#1e40af; }
//     .pill-p { background:#ede9fe; color:#5b21b6; }

//     .table-wrap { overflow-x:auto; -webkit-overflow-scrolling:touch; }
//     table { width:100%; border-collapse:collapse; min-width:500px; }
//     th { padding:.5rem .65rem; text-align:left; font-size:.7rem; font-weight:700; color:#0e7490; background:#f0f9ff; text-transform:uppercase; white-space:nowrap; }
//     td { padding:.55rem .65rem; border-bottom:1px solid #f1f5f9; font-size:.82rem; vertical-align:top; }
//     tr:last-child td { border-bottom:none; }

//     .cname { font-weight:700; font-size:.82rem; }
//     .csub { font-size:.7rem; color:#64748b; }
//     .product-line { display:flex; align-items:center; gap:.3rem; margin-bottom:.15rem; font-size:.78rem; flex-wrap:wrap; }
//     .ptag { background:#e0f2fe; color:#0369a1; padding:.1rem .35rem; border-radius:4px; font-size:.7rem; font-weight:600; }
//     .qty { font-weight:700; color:#0e7490; }
//     .rate { color:#94a3b8; font-size:.7rem; }
//     .amt { color:#0e7490; }
//     .time-col { font-size:.72rem; color:#64748b; white-space:nowrap; }

//     .badge { display:inline-block; padding:.15rem .5rem; border-radius:10px; font-size:.7rem; font-weight:700; }
//     .bs { background:#d1fae5; color:#065f46; }
//     .bd { background:#fee2e2; color:#991b1b; }

//     .abts { display:flex; gap:.3rem; flex-wrap:wrap; }
//     .btn { display:inline-flex; align-items:center; gap:.25rem; padding:.4rem .8rem; border-radius:8px; border:none; cursor:pointer; font-weight:700; font-size:.8rem; white-space:nowrap; }
//     .btn-primary { background:#0891b2; color:#fff; }
//     .btn-outline { background:transparent; color:#0891b2; border:1.5px solid #0891b2; }
//     .btn-success { background:#10b981; color:#fff; }
//     .btn-danger  { background:#ef4444; color:#fff; }
//     .btn-sm { padding:.3rem .6rem; font-size:.75rem; }
//     .btn:disabled { opacity:.6; cursor:not-allowed; }
//     .empty { text-align:center; padding:2rem; color:#94a3b8; font-size:.88rem; }

//     /* Modal */
//     .overlay { position:fixed; inset:0; background:rgba(0,0,0,.5); display:flex; justify-content:center; align-items:center; z-index:9999; padding:1rem; }
//     .modal { width:100%; max-width:480px; background:#fff; border-radius:12px; padding:20px; max-height:90vh; overflow-y:auto; }
//     .modal-head { display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; }
//     .modal-head h3 { margin:0; font-family:'Poppins',sans-serif; font-size:.95rem; }
//     .close-btn { border:none; background:none; font-size:18px; cursor:pointer; color:#64748b; padding:4px; }
//     .close-btn:hover { color:#ef4444; }
//     .form-group { margin-bottom:14px; }
//     .form-group label { display:block; margin-bottom:5px; font-weight:600; font-size:.85rem; }
//     .form-group select,
//     .form-group input { width:100%; padding:8px 10px; border:1px solid #e2e8f0; border-radius:8px; font-size:.85rem; box-sizing:border-box; outline:none; }
//     .form-group select:focus,
//     .form-group input:focus { border-color:#0891b2; }
//     .product-row { display:grid; grid-template-columns:2fr 1fr auto; gap:6px; align-items:center; margin-bottom:6px; }
//     .product-row select, .product-row input { width:100%; }
//     .btn-remove { background:#fee2e2; color:#ef4444; border:none; width:30px; height:30px; border-radius:6px; cursor:pointer; font-size:13px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
//     .btn-remove:hover { background:#ef4444; color:#fff; }
//     .btn-add { background:#10b981; color:#fff; border:none; padding:7px 12px; border-radius:8px; cursor:pointer; font-size:.82rem; font-weight:600; margin-top:4px; }
//     .radio-row { display:flex; gap:20px; }
//     .radio-row label { display:flex; align-items:center; gap:5px; font-weight:500; cursor:pointer; font-size:.85rem; }
//     .sale-error { background:#fee2e2; color:#991b1b; padding:.5rem .9rem; border-radius:8px; margin-bottom:10px; font-size:.82rem; }
//     .footer-btns { display:flex; justify-content:flex-end; gap:8px; margin-top:16px; }
//     .cancel-btn { padding:8px 16px; border:1px solid #e2e8f0; background:#fff; border-radius:8px; cursor:pointer; font-size:.85rem; }
//     .save-btn { padding:8px 16px; background:#0891b2; color:#fff; border:none; border-radius:8px; cursor:pointer; font-size:.85rem; font-weight:600; }
//     .save-btn:disabled { opacity:.6; cursor:not-allowed; }

//     .toast-container { position:fixed; top:1rem; right:1rem; z-index:2000; display:flex; flex-direction:column; gap:.4rem; }
//     .toast { padding:.55rem 1rem; border-radius:9px; font-weight:700; font-size:.82rem; color:#fff; }
//     .toast-success { background:#10b981; }
//     .toast-error { background:#ef4444; }

//     /* Responsive */
//     @media(max-width:600px) {
//       .ctrl-bar { flex-direction:column; align-items:flex-start; }
//       .date-input { width:130px; }
//       .pt { font-size:1rem; }
//     }

//     @media(max-width:360px) {
//       .date-nav { gap:.25rem; }
//       .btn-sm { padding:.25rem .5rem; font-size:.72rem; }
//       .date-input { width:110px; }
//     }
//   `]
// })
// export class DailyReportComponent implements OnInit {
//   sales: any[] = [];
//   products: any[] = [];
//   loading = false;
//   selectedDate = new Date();
//   toasts: { msg: string; type: string }[] = [];

//   editSale: any = null;
//   editItems: { productId: number; quantity: number }[] = [];
//   editIsPaid = false;
//   editRemarks = '';
//   editSaving = false;
//   editError = '';

//   get dateStr() { return this.fmt(this.selectedDate); }
//   get paidCount()    { return this.sales.filter(s => s.isPaid).length; }
//   get unpaidCount()  { return this.sales.filter(s => !s.isPaid).length; }
//   get totalRevenue() { return this.sales.reduce((sum, s) => sum + s.totalAmount, 0); }

//   constructor(private http: HttpClient) {}

//   ngOnInit() { this.loadProducts(); this.loadSales(); }

//   loadProducts() {
//     this.http.get<any[]>(`${environment.apiUrl}/Product`).subscribe({
//       next: res => this.products = res
//     });
//   }

//   loadSales() {
//     this.loading = true;
//     this.http.get<any[]>(`${environment.apiUrl}/DailySale/date/${this.dateStr}`).subscribe({
//       next: res => { this.sales = res; this.loading = false; },
//       error: () => { this.loading = false; this.toast('Failed to load', 'error'); }
//     });
//   }

//   onDateChange(e: any) { this.selectedDate = new Date(e.target.value); this.loadSales(); }
//   prevDay() { this.selectedDate = new Date(this.selectedDate.getTime() - 86400000); this.loadSales(); }
//   nextDay() { this.selectedDate = new Date(this.selectedDate.getTime() + 86400000); this.loadSales(); }
//   goToday() { this.selectedDate = new Date(); this.loadSales(); }

//   markPaid(s: any) {
//     this.http.patch(`${environment.apiUrl}/DailySale/${s.id}/mark-paid`, {}).subscribe({
//       next: () => { this.toast('Marked as paid!', 'success'); this.loadSales(); },
//       error: () => this.toast('Failed', 'error')
//     });
//   }

//   deleteSale(s: any) {
//     if (!confirm(`Delete sale for ${s.customer?.name}?`)) return;
//     this.http.delete(`${environment.apiUrl}/DailySale/${s.id}`).subscribe({
//       next: () => { this.toast('Deleted!', 'success'); this.loadSales(); },
//       error: () => this.toast('Failed to delete', 'error')
//     });
//   }

//   openEdit(s: any) {
//     this.editSale    = s;
//     this.editIsPaid  = s.isPaid;
//     this.editRemarks = s.remarks ?? '';
//     this.editItems   = s.items.map((i: any) => ({ productId: i.productId, quantity: i.quantity }));
//     this.editError   = '';
//   }

//   closeEdit() { this.editSale = null; }
//   addEditItem() { this.editItems.push({ productId: 0, quantity: 1 }); }
//   removeEditItem(i: number) { this.editItems.splice(i, 1); }

//   saveEdit() {
//     if (this.editItems.some(i => i.productId === 0 || i.quantity < 0.1)) {
//       this.editError = 'Please select all products and enter valid quantities.';
//       return;
//     }
//     this.editSaving = true;
//     this.editError  = '';
//     this.http.put(`${environment.apiUrl}/DailySale/${this.editSale.id}`, {
//       isPaid: this.editIsPaid, remarks: this.editRemarks, items: this.editItems
//     }).subscribe({
//       next: () => { this.editSaving = false; this.toast('Sale updated!', 'success'); this.closeEdit(); this.loadSales(); },
//       error: () => { this.editSaving = false; this.editError = 'Failed to update. Please try again.'; }
//     });
//   }

//   fmt(d: Date) { return d.toISOString().split('T')[0]; }
//   toast(msg: string, type: string) {
//     const t = { msg, type };
//     this.toasts.push(t);
//     setTimeout(() => this.toasts.splice(this.toasts.indexOf(t), 1), 3000);
//   }
// }
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-daily-report',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="toast-container">
      <div *ngFor="let t of toasts" class="toast" [class]="'toast-'+t.type">{{ t.msg }}</div>
    </div>

    <div class="page-container">
      <header class="ph">
        <div>
          <div class="breadcrumb">
            <a routerLink="/dashboard" class="brand-link">📊 Dashboard</a> 
            <span class="divider">/</span>
            <span class="current-page">🛒 Daily Sales</span>
          </div>
          <div class="ps">View and manage daily quick sales transactions</div>
        </div>
      </header>

      <div class="card ctrl-bar">
        <div class="date-nav">
          <button class="btn btn-outline btn-icon" title="Previous Day" (click)="prevDay()">◀</button>
          <input type="date" class="form-control date-input" [value]="dateStr" (change)="onDateChange($event)" />
          <button class="btn btn-outline btn-icon" title="Next Day" (click)="nextDay()">▶</button>
          <button class="btn btn-primary btn-today" (click)="goToday()">Today</button>
        </div>
        
        <div class="pills">
          <span class="pill pill-b">📦 {{ sales.length }} Sales</span>
          <span class="pill pill-g">✅ {{ paidCount }} Paid</span>
          <span class="pill pill-r">🔴 {{ unpaidCount }} Unpaid</span>
          <span class="pill pill-p">💰 ₹{{ totalRevenue | number:'1.0-0' }}</span>
        </div>
      </div>

      <div class="card mt">
        <div *ngIf="loading" class="empty state-msg">⏳ Loading sales data...</div>
        <div *ngIf="!loading && sales.length === 0" class="empty state-msg">No sales recorded for this date.</div>
        
        <div class="table-wrap" *ngIf="!loading && sales.length > 0">
          <table>
            <thead>
              <tr>
                <th class="w-seq">#</th>
                <th>Customer Details</th>
                <th>Products Sold</th>
                <th>Total Amt</th>
                <th>Status</th>
                <th>Time</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let s of sales; let i=index" class="hover-row" [style.background]="s.isPaid ? '#f8fafc' : '#fffbeb'">
                <td><span class="rank">{{ i+1 }}</span></td>
                <td>
                  <div class="cname">{{ s.customer?.name || 'Unknown Customer' }}</div>
                  <div class="csub">{{ s.customer?.phone }}</div>
                </td>
                <td>
                  <div *ngFor="let item of s.items" class="product-line">
                    <span class="ptag" title="{{ item.product?.name }}">{{ item.product?.name }}</span>
                    <span class="qty-badge">{{ item.quantity }} {{ item.product?.unit == 1 ? 'L' : 'Kg' }}</span>
                    <span class="rate-txt">&#64; ₹{{ item.rate }}</span>
                  </div>
                </td>
                <td><strong class="amt">₹{{ s.totalAmount | number:'1.0-0' }}</strong></td>
                <td>
                  <span class="badge" [class.bs]="s.isPaid" [class.bd]="!s.isPaid">
                    {{ s.isPaid ? 'Paid' : 'Pending' }}
                  </span>
                </td>
                <td class="time-col">{{ s.saleDate | date:'shortTime' }}</td>
                <td>
                  <div class="abts">
                    <button *ngIf="!s.isPaid" class="action-btn btn-success-light" title="Mark as Paid" (click)="markPaid(s)">✅</button>
                    <button class="action-btn btn-edit" title="Edit Sale" (click)="openEdit(s)">✏️</button>
                    <button class="action-btn btn-delete" title="Delete Sale" (click)="deleteSale(s)">🗑️</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="overlay" *ngIf="editSale" (click)="closeEdit()">
      <div class="modal" (click)="$event.stopPropagation()">
        
        <div class="modal-head">
          <h3>✏️ Edit Sale — <span class="text-cyan">{{ editSale.customer?.name }}</span></h3>
          <button class="close-btn" (click)="closeEdit()">✕</button>
        </div>

        <div class="modal-body">
          <div class="prod-section">
            <label class="section-lbl">📦 Update Products</label>
            <div class="prod-row" *ngFor="let item of editItems; let i=index">
              <div class="prod-input-group">
                <select [(ngModel)]="item.productId">
                  <option [ngValue]="0" disabled>Select Product...</option>
                  <option *ngFor="let p of products" [ngValue]="p.id">{{ p.name }}</option>
                </select>
                <input type="number" min="0.1" step="0.1" placeholder="Qty" [(ngModel)]="item.quantity" />
              </div>
              <button type="button" class="btn-remove" title="Remove Item" (click)="removeEditItem(i)">✕</button>
            </div>
            <button type="button" class="btn btn-sm btn-outline-add mt-half" (click)="addEditItem()">+ Add Product</button>
          </div>

          <div class="form-grid mt">
            <div class="fg">
              <label>Payment Status</label>
              <div class="radio-row">
                <label class="radio-label"><input type="radio" name="epay" [value]="true"  [(ngModel)]="editIsPaid"> <span class="badge bs">Paid</span></label>
                <label class="radio-label"><input type="radio" name="epay" [value]="false" [(ngModel)]="editIsPaid"> <span class="badge bd">Unpaid</span></label>
              </div>
            </div>

            <div class="fg">
              <label>Remarks</label>
              <input type="text" class="form-control" [(ngModel)]="editRemarks" placeholder="Optional notes about this sale" />
            </div>
          </div>

          <div *ngIf="editError" class="alert error-msg">❌ {{ editError }}</div>
        </div>

        <div class="modal-foot">
          <button class="btn btn-cancel" (click)="closeEdit()">Cancel</button>
          <button class="btn btn-primary" (click)="saveEdit()" [disabled]="editSaving">
            {{ editSaving ? '⏳ Saving...' : '💾 Save Changes' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Base */
    :host { 
      display: block; 
      font-family: 'Inter', 'Poppins', system-ui, -apple-system, sans-serif;
      color: #334155;
    }
    * { box-sizing: border-box; }
    
    .page-container { max-width: 1400px; margin: 0 auto; }
    .mt { margin-top: 1.25rem; }
    .mt-half { margin-top: 0.5rem; }

    /* Header & Navigation */
    .ph { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; gap: 1rem; flex-wrap: wrap; }
    
    .breadcrumb { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
    .brand-link { font-family: 'Poppins', sans-serif; font-size: 1rem; font-weight: 700; color: #0891b2; text-decoration: none; transition: color 0.2s; }
    .brand-link:hover { color: #0e7490; text-decoration: underline; }
    .divider { color: #cbd5e1; font-weight: 600; }
    .current-page { font-family: 'Poppins', sans-serif; font-size: 1.2rem; font-weight: 800; color: #0f172a; }
    .ps { color: #64748b; font-size: 0.85rem; }

    /* Cards */
    .card { background: #fff; border-radius: 12px; padding: 1.25rem; box-shadow: 0 2px 8px rgba(0,0,0,0.04); margin-bottom: 1rem; }

    /* Control Bar (Dates & Pills) */
    .ctrl-bar { display: flex; flex-wrap: wrap; gap: 1rem; align-items: center; justify-content: space-between; }
    .date-nav { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }
    
    .form-control { 
      width: 100%; padding: 0.6rem 0.85rem; border: 1px solid #cbd5e1; 
      border-radius: 8px; font-size: 0.9rem; font-family: inherit; color: #0f172a; 
      transition: border-color 0.2s, box-shadow 0.2s; outline: none;
    }
    .form-control:focus { border-color: #0891b2; box-shadow: 0 0 0 3px rgba(8,145,178,0.1); }
    .date-input { width: 160px; cursor: pointer; }

    .pills { display: flex; gap: 0.5rem; flex-wrap: wrap; }
    .pill { padding: 0.4rem 0.8rem; border-radius: 20px; font-size: 0.75rem; font-weight: 700; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
    .pill-g { background: #d1fae5; color: #065f46; border: 1px solid #a7f3d0; }
    .pill-r { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }
    .pill-b { background: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd; }
    .pill-p { background: #f3e8ff; color: #6b21a8; border: 1px solid #e9d5ff; }

    /* Table */
    .table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; border-radius: 8px; border: 1px solid #f1f5f9; }
    table { width: 100%; border-collapse: collapse; min-width: 650px; text-align: left; }
    th { padding: 0.85rem 1rem; font-size: 0.75rem; font-weight: 700; color: #64748b; background: #f8fafc; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e2e8f0; }
    td { padding: 0.85rem 1rem; border-bottom: 1px solid #e2e8f0; font-size: 0.85rem; vertical-align: middle; }
    .hover-row { transition: background 0.2s; }
    tr:last-child td { border-bottom: none; }
    
    .w-seq { width: 40px; }
    .text-right { text-align: right; }
    
    .rank { display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; background: #e2e8f0; color: #334155; border-radius: 50%; font-size: 0.75rem; font-weight: 700; }
    .cname { font-weight: 700; color: #0f172a; font-size: 0.95rem; }
    .csub { font-size: 0.75rem; color: #64748b; margin-top: 2px; }
    
    /* Product Lines */
    .product-line { display: flex; align-items: center; gap: 0.4rem; margin-bottom: 0.3rem; font-size: 0.8rem; flex-wrap: wrap; }
    .ptag { background: #f0f9ff; color: #0369a1; padding: 0.15rem 0.4rem; border-radius: 6px; font-weight: 600; border: 1px solid #e0f2fe; }
    .qty-badge { background: #bae6fd; color: #075985; padding: 0.15rem 0.4rem; border-radius: 4px; font-size: 0.75rem; font-weight: 700; }
    .rate-txt { color: #64748b; font-size: 0.75rem; font-weight: 500; }
    
    .amt { color: #0f172a; font-size: 0.95rem; font-weight: 800; }
    .time-col { font-size: 0.75rem; color: #64748b; font-weight: 500; white-space: nowrap; }

    /* Badges & Buttons */
    .badge { display: inline-block; padding: 0.3rem 0.7rem; border-radius: 12px; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.3px; }
    .bs { background: #d1fae5; color: #065f46; border: 1px solid #a7f3d0; }
    .bd { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }

    .abts { display: flex; gap: 0.4rem; justify-content: flex-end; }
    .action-btn { 
      width: 32px; height: 32px; border-radius: 8px; border: none; cursor: pointer; 
      display: flex; align-items: center; justify-content: center; font-size: 0.9rem;
      transition: all 0.2s; background: #fff; color: #475569; border: 1px solid #e2e8f0;
    }
    .action-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
    .btn-edit:hover { background: #e0f2fe; color: #0284c7; border-color: #bae6fd; }
    .btn-delete:hover { background: #fee2e2; color: #ef4444; border-color: #fecaca; }
    .btn-success-light:hover { background: #d1fae5; color: #059669; border-color: #a7f3d0; }

    .btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 0.6rem 1.2rem; border-radius: 10px; border: none; cursor: pointer; font-weight: 600; font-size: 0.9rem; transition: all 0.2s; font-family: inherit; }
    .btn-sm { padding: 0.4rem 0.8rem; font-size: 0.8rem; }
    .btn-icon { padding: 0.6rem; width: 38px; }
    
    .btn-primary { background: #0891b2; color: #fff; box-shadow: 0 2px 4px rgba(8,145,178,0.2); }
    .btn-primary:hover:not(:disabled) { background: #0e7490; transform: translateY(-1px); }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
    
    .btn-outline { background: #f8fafc; color: #475569; border: 1px solid #cbd5e1; }
    .btn-outline:hover { background: #f1f5f9; color: #0f172a; }
    
    .btn-cancel { background: #f1f5f9; color: #475569; border: 1px solid #e2e8f0; }
    .btn-cancel:hover { background: #e2e8f0; }
    
    .btn-outline-add { background: #f0fdf4; color: #16a34a; border: 1px dashed #22c55e; width: 100%; border-radius: 8px; }
    .btn-outline-add:hover { background: #dcfce7; }
    
    .state-msg { padding: 3rem 1rem; font-weight: 500; font-size: 0.95rem; text-align: center; color: #64748b; }

    /* Modal Form */
    .overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.6); backdrop-filter: blur(2px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 1rem; }
    .modal { background: #fff; border-radius: 16px; width: 100%; max-width: 520px; max-height: 90vh; display: flex; flex-direction: column; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); }
    
    .modal-head { display: flex; justify-content: space-between; align-items: center; padding: 1.25rem 1.5rem; border-bottom: 1px solid #f1f5f9; }
    .modal-head h3 { margin: 0; font-size: 1.1rem; font-family: 'Poppins', sans-serif; color: #0f172a; }
    .text-cyan { color: #0891b2; }
    
    .close-btn { background: #f1f5f9; border: none; border-radius: 50%; width: 32px; height: 32px; cursor: pointer; font-size: 1rem; color: #64748b; display: flex; align-items: center; justify-content: center; transition: background 0.2s; }
    .close-btn:hover { background: #fee2e2; color: #ef4444; }

    .modal-body { padding: 1.5rem; overflow-y: auto; flex-grow: 1; }
    
    .section-lbl { display: block; font-weight: 700; font-size: 0.9rem; color: #0f172a; margin-bottom: 0.75rem; }
    
    /* Edit Products Section */
    .prod-section { background: #f8fafc; border-radius: 12px; padding: 1rem; border: 1px solid #f1f5f9; }
    .prod-row { display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.5rem; }
    .prod-input-group { display: flex; flex: 1; gap: 0.5rem; background: #fff; padding: 0.3rem; border-radius: 8px; border: 1px solid #cbd5e1; transition: border-color 0.2s; }
    .prod-input-group:focus-within { border-color: #0891b2; box-shadow: 0 0 0 3px rgba(8,145,178,0.1); }
    .prod-input-group select { flex: 1; padding: 0.4rem; border: none; font-size: 0.85rem; outline: none; font-family: inherit; background: transparent; cursor: pointer; min-width: 0; }
    .prod-input-group input { width: 80px; padding: 0.4rem; border: none; border-left: 1px solid #e2e8f0; font-size: 0.85rem; outline: none; font-family: inherit; text-align: center; }
    
    .btn-remove { background: #fee2e2; color: #ef4444; border: none; border-radius: 8px; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 0.9rem; flex-shrink: 0; transition: background 0.2s; }
    .btn-remove:hover { background: #ef4444; color: #fff; }

    .form-grid { display: flex; flex-direction: column; gap: 1.25rem; }
    .fg label { display: block; font-weight: 600; font-size: 0.85rem; color: #475569; margin-bottom: 0.5rem; }
    
    .radio-row { display: flex; gap: 1.5rem; }
    .radio-label { display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 0.9rem; font-weight: 500; }

    .alert { padding: 0.8rem 1rem; border-radius: 8px; font-size: 0.85rem; font-weight: 500; margin-top: 1rem; }
    .error-msg { background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5; }

    .modal-foot { display: flex; justify-content: flex-end; gap: 0.75rem; padding: 1.25rem 1.5rem; border-top: 1px solid #e2e8f0; background: #f8fafc; border-radius: 0 0 16px 16px; }

    /* Toasts */
    .toast-container { position: fixed; top: 1rem; right: 1rem; z-index: 9999; display: flex; flex-direction: column; gap: 0.5rem; }
    .toast { padding: 0.75rem 1.25rem; border-radius: 10px; font-weight: 600; font-size: 0.85rem; color: #fff; box-shadow: 0 4px 12px rgba(0,0,0,0.15); animation: slideIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
    @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    .toast-success { background: #10b981; border: 1px solid #059669; }
    .toast-error { background: #ef4444; border: 1px solid #b91c1c; }

    /* =========================================================
       EXTREME RESPONSIVENESS (Phones & Galaxy Fold)
       ========================================================= */

    @media (max-width: 768px) {
      .text-right { text-align: left; }
      .abts { justify-content: flex-start; }
    }

    /* Standard Phones (< 600px) */
    @media (max-width: 600px) {
      .ph { flex-direction: column; align-items: stretch; }
      
      .ctrl-bar { flex-direction: column; align-items: stretch; gap: 1rem; }
      .date-nav { justify-content: space-between; }
      .date-input { flex: 1; }
      .btn-today { width: 100%; }
      .pills { justify-content: center; }
      
      th, td { padding: 0.6rem; font-size: 0.8rem; }
      .cname { font-size: 0.85rem; }
      
      .modal-body { padding: 1rem; }
      .modal-foot { flex-direction: column-reverse; padding: 1rem; }
      .modal-foot .btn { width: 100%; justify-content: center; }
    }

    /* Fold Outer Screen (~280px - 360px) */
    @media (max-width: 380px) {
      .card { padding: 0.85rem; }
      .current-page { font-size: 1rem; }
      
      .date-nav .btn-icon { padding: 0.5rem; width: 32px; }
      .date-input { font-size: 0.8rem; padding: 0.5rem; }
      
      .pill { flex: 1; text-align: center; font-size: 0.7rem; padding: 0.4rem 0.2rem; }
      
      .prod-row { flex-direction: column; align-items: stretch; }
      .btn-remove { width: 100%; margin-top: 4px; }
      .prod-input-group { flex-direction: column; padding: 0; border: none; gap: 4px; background: transparent; }
      .prod-input-group select, .prod-input-group input { width: 100%; border: 1px solid #cbd5e1; border-radius: 8px; padding: 0.6rem; text-align: left; }
      .prod-input-group:focus-within { box-shadow: none; }
    }
  `]
})
export class DailyReportComponent implements OnInit {
  sales: any[] = [];
  products: any[] = [];
  loading = false;
  selectedDate = new Date();
  toasts: { msg: string; type: string }[] = [];

  editSale: any = null;
  editItems: { productId: number; quantity: number }[] = [];
  editIsPaid = false;
  editRemarks = '';
  editSaving = false;
  editError = '';

  get dateStr() { return this.fmt(this.selectedDate); }
  get paidCount()    { return this.sales.filter(s => s.isPaid).length; }
  get unpaidCount()  { return this.sales.filter(s => !s.isPaid).length; }
  get totalRevenue() { return this.sales.reduce((sum, s) => sum + s.totalAmount, 0); }

  constructor(private http: HttpClient) {}

  ngOnInit() { 
    this.loadProducts(); 
    this.loadSales(); 
  }

  loadProducts() {
    this.http.get<any[]>(`${environment.apiUrl}/Product`).subscribe({
      next: res => this.products = res
    });
  }

  loadSales() {
    this.loading = true;
    this.http.get<any[]>(`${environment.apiUrl}/DailySale/date/${this.dateStr}`).subscribe({
      next: res => { this.sales = res; this.loading = false; },
      error: () => { this.loading = false; this.toast('Failed to load sales data', 'error'); }
    });
  }

  onDateChange(e: any) { 
    this.selectedDate = new Date(e.target.value); 
    this.loadSales(); 
  }
  
  prevDay() { 
    this.selectedDate = new Date(this.selectedDate.getTime() - 86400000); 
    this.loadSales(); 
  }
  
  nextDay() { 
    this.selectedDate = new Date(this.selectedDate.getTime() + 86400000); 
    this.loadSales(); 
  }
  
  goToday() { 
    this.selectedDate = new Date(); 
    this.loadSales(); 
  }

  markPaid(s: any) {
    this.http.patch(`${environment.apiUrl}/DailySale/${s.id}/mark-paid`, {}).subscribe({
      next: () => { 
        this.toast('Sale marked as paid!', 'success'); 
        this.loadSales(); 
      },
      error: () => this.toast('Failed to update status', 'error')
    });
  }

  deleteSale(s: any) {
    if (!confirm(`Are you sure you want to delete this sale for ${s.customer?.name}?`)) return;
    this.http.delete(`${environment.apiUrl}/DailySale/${s.id}`).subscribe({
      next: () => { 
        this.toast('Sale deleted successfully!', 'success'); 
        this.loadSales(); 
      },
      error: () => this.toast('Failed to delete sale', 'error')
    });
  }

  openEdit(s: any) {
    this.editSale    = s;
    this.editIsPaid  = s.isPaid;
    this.editRemarks = s.remarks ?? '';
    this.editItems   = s.items.map((i: any) => ({ productId: i.productId, quantity: i.quantity }));
    this.editError   = '';
    
    // Lock body scrolling when modal is open
    document.body.style.overflow = 'hidden';
  }

  closeEdit() { 
    this.editSale = null; 
    document.body.style.overflow = 'auto'; // Restore scrolling
  }
  
  addEditItem() { 
    this.editItems.push({ productId: 0, quantity: 1 }); 
  }
  
  removeEditItem(i: number) { 
    this.editItems.splice(i, 1); 
  }

  saveEdit() {
    if (this.editItems.length === 0) {
      this.editError = 'A sale must have at least one product.';
      return;
    }
    
    if (this.editItems.some(i => i.productId === 0 || i.quantity < 0.1)) {
      this.editError = 'Please select products and enter valid quantities greater than 0.';
      return;
    }
    
    this.editSaving = true;
    this.editError  = '';
    
    this.http.put(`${environment.apiUrl}/DailySale/${this.editSale.id}`, {
      isPaid: this.editIsPaid, 
      remarks: this.editRemarks, 
      items: this.editItems
    }).subscribe({
      next: () => { 
        this.editSaving = false; 
        this.toast('Sale updated successfully!', 'success'); 
        this.closeEdit(); 
        this.loadSales(); 
      },
      error: () => { 
        this.editSaving = false; 
        this.editError = 'Failed to update sale. Please try again.'; 
      }
    });
  }

  fmt(d: Date) { 
    // Format YYYY-MM-DD safely handling timezones
    const offset = d.getTimezoneOffset();
    const localDate = new Date(d.getTime() - (offset * 60 * 1000));
    return localDate.toISOString().split('T')[0];
  }

  toast(msg: string, type: 'success' | 'error') {
    const t = { msg, type };
    this.toasts.push(t);
    setTimeout(() => {
      const index = this.toasts.indexOf(t);
      if (index > -1) this.toasts.splice(index, 1);
    }, 3000);
  }
}