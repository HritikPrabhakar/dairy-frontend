// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { HttpClient } from '@angular/common/http';
// import { environment } from '../../../environments/environment';

// interface Bill { id: number; customerId: number; customerName: string; customerPhone: string; customerAddress: string; billMonth: string; generatedAt: string; totalAmount: number; isPaid: boolean; items: BillItem[]; }
// interface BillItem { productName: string; totalQuantity: number; unit: string; pricePerUnit: number; totalPrice: number; }
// interface Customer { id: number; name: string; phone: string; isActive: boolean; }

// @Component({
//   selector: 'app-bills',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   template: `
//     <div class="toast-container">
//       <div *ngFor="let t of toasts" class="toast" [class]="'toast-'+t.type">{{ t.msg }}</div>
//     </div>

//     <div class="ph">
//       <div><div class="pt">🧾 Bills</div><div class="ps">Generate monthly bills and download PDF</div></div>
//       <button class="btn btn-primary" (click)="showGen=true">➕ Generate</button>
//     </div>

//     <!-- Filter -->
//     <div class="card filter-bar">
//       <input type="text" class="form-control" placeholder="🔍 Search customer..."
//              [(ngModel)]="search" (input)="applyFilter()" />
//       <select class="form-control sel-status" [(ngModel)]="filterPaid" (change)="applyFilter()">
//         <option value="all">All Status</option>
//         <option value="paid">Paid</option>
//         <option value="pending">Pending</option>
//       </select>
//       <div class="summary-txt">
//         Total: <strong>₹{{ totalAmt | number:'1.0-0' }}</strong>
//         &nbsp;|&nbsp;
//         Pending: <strong style="color:#ef4444">₹{{ pendingAmt | number:'1.0-0' }}</strong>
//       </div>
//     </div>

//     <!-- Table -->
//     <div class="card">
//       <div *ngIf="loading" class="empty">⏳ Loading...</div>
//       <div *ngIf="!loading && filtered.length===0" class="empty">No bills found. Generate a bill first.</div>
//       <div class="table-wrap" *ngIf="!loading && filtered.length>0">
//         <table>
//           <thead>
//             <tr>
//               <th>#</th>
//               <th>Customer</th>
//               <th>Month</th>
//               <th class="hide-xs">Items</th>
//               <th>Total</th>
//               <th class="hide-sm">Generated</th>
//               <th>Status</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             <tr *ngFor="let b of filtered; let i=index">
//               <td>{{ i+1 }}</td>
//               <td>
//                 <div class="cname">{{ b.customerName }}</div>
//                 <div class="csub">{{ b.customerPhone }}</div>
//               </td>
//               <td><strong>{{ b.billMonth | date:'MMM yyyy' }}</strong></td>
//               <td class="hide-xs">{{ b.items.length }} products</td>
//               <td><strong class="amt">₹{{ b.totalAmount | number:'1.0-0' }}</strong></td>
//               <td class="hide-sm">{{ b.generatedAt | date:'dd/MM/yyyy' }}</td>
//               <td>
//                 <span class="badge" [class.bs]="b.isPaid" [class.bd]="!b.isPaid">
//                   {{ b.isPaid ? '✅ Paid' : '⏳ Pending' }}
//                 </span>
//               </td>
//               <td>
//                 <div class="abts">
//                   <button class="btn btn-sm btn-outline" (click)="viewBill(b)">👁️</button>
//                   <button class="btn btn-sm btn-primary" (click)="downloadPdf(b)" [disabled]="downloading===b.id">
//                     {{ downloading===b.id ? '⏳' : '📄' }}
//                   </button>
//                   <button *ngIf="!b.isPaid" class="btn btn-sm btn-success" (click)="markPaid(b)">✅</button>
//                 </div>
//               </td>
//             </tr>
//           </tbody>
//         </table>
//       </div>
//     </div>

//     <!-- Generate Modal -->
//     <div class="overlay" *ngIf="showGen" (click)="showGen=false">
//       <div class="modal" (click)="$event.stopPropagation()">
//         <div class="modal-head">
//           <h3>➕ Generate Monthly Bill</h3>
//           <button class="close-btn" (click)="showGen=false">✕</button>
//         </div>
//         <div class="fg">
//           <label>Customer *</label>
//           <select class="form-control" [(ngModel)]="genForm.customerId">
//             <option [value]="0" disabled>Select customer</option>
//             <option *ngFor="let c of customers" [value]="c.id">{{ c.name }} – {{ c.phone }}</option>
//           </select>
//         </div>
//         <div class="month-grid">
//           <div class="fg">
//             <label>Month *</label>
//             <select class="form-control" [(ngModel)]="genForm.month">
//               <option *ngFor="let m of months; let i=index" [value]="i+1">{{ m }}</option>
//             </select>
//           </div>
//           <div class="fg">
//             <label>Year *</label>
//             <select class="form-control" [(ngModel)]="genForm.year">
//               <option *ngFor="let y of years" [value]="y">{{ y }}</option>
//             </select>
//           </div>
//         </div>
//         <div class="info-note">ℹ️ Aggregates all delivered daily records for selected month.</div>
//         <div class="modal-foot">
//           <button class="btn btn-outline" (click)="showGen=false">Cancel</button>
//           <button class="btn btn-primary" (click)="generateBill()" [disabled]="generating">
//             {{ generating ? '⏳ Generating...' : '🧾 Generate' }}
//           </button>
//         </div>
//       </div>
//     </div>

//     <!-- View Bill Modal -->
//     <div class="overlay" *ngIf="selectedBill" (click)="selectedBill=null">
//       <div class="modal modal-lg" (click)="$event.stopPropagation()">
//         <div class="modal-head">
//           <h3>🧾 Bill Details</h3>
//           <button class="close-btn" (click)="selectedBill=null">✕</button>
//         </div>
//         <div class="bill-info">
//           <div class="bi-row"><span>Customer:</span><strong>{{ selectedBill.customerName }}</strong></div>
//           <div class="bi-row"><span>Phone:</span><strong>{{ selectedBill.customerPhone }}</strong></div>
//           <div class="bi-row"><span>Address:</span><strong>{{ selectedBill.customerAddress }}</strong></div>
//           <div class="bi-row"><span>Month:</span><strong>{{ selectedBill.billMonth | date:'MMMM yyyy' }}</strong></div>
//           <div class="bi-row"><span>Status:</span>
//             <span class="badge" [class.bs]="selectedBill.isPaid" [class.bd]="!selectedBill.isPaid">
//               {{ selectedBill.isPaid ? 'Paid' : 'Pending' }}
//             </span>
//           </div>
//         </div>
//         <div class="table-wrap">
//           <table class="bill-table">
//             <thead><tr><th>Product</th><th>Qty</th><th>Unit</th><th>Rate (₹)</th><th>Total (₹)</th></tr></thead>
//             <tbody>
//               <tr *ngFor="let item of selectedBill.items">
//                 <td>{{ item.productName }}</td>
//                 <td>{{ item.totalQuantity | number:'1.2-2' }}</td>
//                 <td>{{ item.unit }}</td>
//                 <td>{{ item.pricePerUnit | number:'1.2-2' }}</td>
//                 <td><strong>{{ item.totalPrice | number:'1.2-2' }}</strong></td>
//               </tr>
//             </tbody>
//             <tfoot>
//               <tr class="total-row">
//                 <td colspan="4"><strong>TOTAL</strong></td>
//                 <td><strong>₹ {{ selectedBill.totalAmount | number:'1.2-2' }}</strong></td>
//               </tr>
//             </tfoot>
//           </table>
//         </div>
//         <div class="modal-foot">
//           <button class="btn btn-outline" (click)="selectedBill=null">Close</button>
//           <button class="btn btn-primary" (click)="downloadPdf(selectedBill)">📄 PDF</button>
//           <button *ngIf="!selectedBill.isPaid" class="btn btn-success" (click)="markPaid(selectedBill);selectedBill=null">✅ Mark Paid</button>
//         </div>
//       </div>
//     </div>
//   `,
//   styles: [`
//     :host { display:block; }

//     .ph { display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; gap:.5rem; flex-wrap:wrap; }
//     .pt { font-family:'Poppins',sans-serif; font-size:1.2rem; font-weight:700; }
//     .ps { color:#64748b; font-size:.78rem; }

//     .card { background:#fff; border-radius:12px; padding:1rem 1.25rem; box-shadow:0 1px 3px rgba(0,0,0,.07); margin-bottom:1rem; }
//     .filter-bar { display:flex; gap:.75rem; align-items:center; flex-wrap:wrap; }
//     .form-control { width:100%; padding:.5rem .85rem; border:1.5px solid #e2e8f0; border-radius:8px; font-size:.85rem; outline:none; box-sizing:border-box; }
//     .form-control:focus { border-color:#0891b2; }
//     .sel-status { width:130px; flex-shrink:0; }
//     .summary-txt { margin-left:auto; font-size:.82rem; color:#64748b; white-space:nowrap; }

//     .table-wrap { overflow-x:auto; -webkit-overflow-scrolling:touch; }
//     table { width:100%; border-collapse:collapse; min-width:480px; }
//     th { padding:.5rem .65rem; text-align:left; font-size:.7rem; font-weight:700; color:#0e7490; background:#f0f9ff; text-transform:uppercase; white-space:nowrap; }
//     td { padding:.55rem .65rem; border-bottom:1px solid #f1f5f9; font-size:.82rem; vertical-align:middle; }
//     tr:last-child td { border-bottom:none; }

//     .cname { font-weight:700; }
//     .csub { font-size:.72rem; color:#64748b; }
//     .amt { color:#0e7490; font-size:.92rem; }

//     .badge { display:inline-block; padding:.15rem .5rem; border-radius:10px; font-size:.7rem; font-weight:700; white-space:nowrap; }
//     .bs { background:#d1fae5; color:#065f46; }
//     .bd { background:#fee2e2; color:#991b1b; }

//     .abts { display:flex; gap:.3rem; flex-wrap:wrap; }
//     .btn { display:inline-flex; align-items:center; gap:.25rem; padding:.4rem .8rem; border-radius:8px; border:none; cursor:pointer; font-weight:700; font-size:.8rem; white-space:nowrap; }
//     .btn-primary { background:#0891b2; color:#fff; }
//     .btn-outline { background:transparent; color:#0891b2; border:1.5px solid #0891b2; }
//     .btn-success { background:#10b981; color:#fff; }
//     .btn-sm { padding:.3rem .6rem; font-size:.75rem; }
//     .btn:disabled { opacity:.6; cursor:not-allowed; }
//     .empty { text-align:center; padding:2rem; color:#94a3b8; font-size:.85rem; }

//     /* Modal */
//     .overlay { position:fixed; inset:0; background:rgba(0,0,0,.45); display:flex; align-items:center; justify-content:center; z-index:1000; padding:1rem; }
//     .modal { background:#fff; border-radius:14px; padding:1.5rem; width:100%; max-width:500px; max-height:90vh; overflow-y:auto; }
//     .modal-lg { max-width:620px; }
//     .modal-head { display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem; }
//     .modal-head h3 { margin:0; font-size:1rem; font-weight:700; }
//     .close-btn { background:none; border:none; cursor:pointer; font-size:1.1rem; color:#64748b; padding:4px; }
//     .close-btn:hover { color:#ef4444; }

//     .fg { margin-bottom:.9rem; }
//     .fg label { display:block; font-weight:700; font-size:.75rem; color:#64748b; margin-bottom:.3rem; }
//     .month-grid { display:grid; grid-template-columns:1fr 1fr; gap:1rem; }
//     .info-note { background:#e0f2fe; color:#0e7490; border-radius:8px; padding:.6rem .9rem; font-size:.8rem; margin-top:.25rem; }
//     .modal-foot { display:flex; justify-content:flex-end; gap:.65rem; margin-top:1.25rem; padding-top:.9rem; border-top:1px solid #e2e8f0; flex-wrap:wrap; }

//     .bill-info { margin-bottom:1rem; display:flex; flex-direction:column; gap:.35rem; }
//     .bi-row { display:flex; gap:.75rem; font-size:.85rem; align-items:center; }
//     .bi-row span:first-child { color:#64748b; min-width:70px; font-size:.8rem; }

//     .bill-table { width:100%; border-collapse:collapse; min-width:360px; }
//     .bill-table th { background:#e0f2fe; color:#0e7490; padding:.5rem .65rem; text-align:left; font-size:.75rem; font-weight:700; text-transform:uppercase; }
//     .bill-table td { padding:.55rem .65rem; border-bottom:1px solid #f1f5f9; font-size:.85rem; }
//     .total-row td { background:#0891b2; color:#fff; border:none; padding:.65rem; font-weight:700; }

//     .toast-container { position:fixed; top:1rem; right:1rem; z-index:2000; display:flex; flex-direction:column; gap:.4rem; }
//     .toast { padding:.55rem 1rem; border-radius:9px; font-weight:700; font-size:.82rem; color:#fff; }
//     .toast-success { background:#10b981; }
//     .toast-error { background:#ef4444; }

//     /* Responsive */
//     @media(max-width:600px) {
//       .summary-txt { margin-left:0; width:100%; }
//       .filter-bar { flex-direction:column; align-items:stretch; }
//       .sel-status { width:100%; }
//       .pt { font-size:1rem; }
//       .month-grid { grid-template-columns:1fr; gap:.5rem; }
//     }

//     @media(max-width:480px) {
//       .hide-xs { display:none; }
//       .modal-foot { justify-content:stretch; }
//       .modal-foot .btn { flex:1; justify-content:center; }
//     }

//     @media(max-width:400px) {
//       .hide-sm { display:none; }
//       .btn-sm { padding:.25rem .45rem; font-size:.72rem; }
//     }
//   `]
// })
// export class BillsComponent implements OnInit {
//   bills: Bill[] = [];
//   filtered: Bill[] = [];
//   customers: Customer[] = [];
//   loading = false; generating = false; downloading: number | null = null;
//   showGen = false; selectedBill: Bill | null = null;
//   search = ''; filterPaid = 'all';
//   toasts: { msg: string; type: string }[] = [];

//   months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
//   years  = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);
//   genForm = { customerId: 0, month: new Date().getMonth() + 1, year: new Date().getFullYear() };

//   get totalAmt()   { return this.filtered.reduce((s, b) => s + b.totalAmount, 0); }
//   get pendingAmt() { return this.filtered.filter(b => !b.isPaid).reduce((s, b) => s + b.totalAmount, 0); }

//   constructor(private http: HttpClient) {}

//   ngOnInit() { this.load(); this.loadCustomers(); }

//   load() {
//     this.loading = true;
//     this.http.get<Bill[]>(`${environment.apiUrl}/Bill`).subscribe({
//       next: d  => { this.bills = d; this.applyFilter(); this.loading = false; },
//       error: () => { this.loading = false; this.toast('Failed to load bills', 'error'); }
//     });
//   }

//   loadCustomers() {
//     this.http.get<Customer[]>(`${environment.apiUrl}/Customer`).subscribe({
//       next: d => this.customers = d.filter(c => c.isActive)
//     });
//   }

//   applyFilter() {
//     let list = [...this.bills];
//     if (this.search)  list = list.filter(b => b.customerName.toLowerCase().includes(this.search.toLowerCase()));
//     if (this.filterPaid === 'paid')    list = list.filter(b => b.isPaid);
//     if (this.filterPaid === 'pending') list = list.filter(b => !b.isPaid);
//     this.filtered = list;
//   }

//   generateBill() {
//     if (!this.genForm.customerId) { this.toast('Select a customer', 'error'); return; }
//     this.generating = true;
//     this.http.post<Bill>(`${environment.apiUrl}/Bill/generate`, this.genForm).subscribe({
//       next: () => { this.generating = false; this.showGen = false; this.load(); this.toast('Bill generated!', 'success'); },
//       error: () => { this.generating = false; this.toast('Failed to generate', 'error'); }
//     });
//   }

//   viewBill(b: Bill) { this.selectedBill = b; }

//   markPaid(b: Bill) {
//     this.http.patch(`${environment.apiUrl}/Bill/${b.id}/mark-paid`, {}).subscribe({
//       next: () => { this.load(); this.toast('Marked as paid!', 'success'); },
//       error: () => this.toast('Failed', 'error')
//     });
//   }

//   downloadPdf(b: Bill) {
//     this.downloading = b.id;
//     this.http.get(`${environment.apiUrl}/Bill/${b.id}/pdf`, {
//       responseType: 'blob', observe: 'response'
//     }).subscribe({
//       next: response => {
//         const blob = response.body!;
//         if (blob.type === 'application/json' || blob.size === 0) {
//           this.downloading = null;
//           this.toast('PDF generation failed on server', 'error');
//           return;
//         }
//         const monthDate  = new Date(b.billMonth);
//         const monthLabel = isNaN(monthDate.getTime()) ? b.billMonth
//           : monthDate.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
//         const url = URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
//         const a   = document.createElement('a');
//         a.href = url;
//         a.download = `Bill_${b.customerName}_${monthLabel}.pdf`;
//         document.body.appendChild(a);
//         a.click();
//         document.body.removeChild(a);
//         setTimeout(() => URL.revokeObjectURL(url), 1000);
//         this.downloading = null;
//         this.toast('PDF downloaded!', 'success');
//       },
//       error: err => {
//         this.downloading = null;
//         if (err.error instanceof Blob) {
//           err.error.text().then((text: string) => this.toast(`PDF failed: ${text}`, 'error'));
//         } else {
//           this.toast(`PDF failed: ${err.status}`, 'error');
//         }
//       }
//     });
//   }

//   toast(msg: string, type: string) {
//     const t = { msg, type };
//     this.toasts.push(t);
//     setTimeout(() => this.toasts.splice(this.toasts.indexOf(t), 1), 3500);
//   }
// }
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';
// NOTE: Verify this relative path matches your folder structure!
import { PaginationComponent } from '../../pagination/pagination.component';

interface Bill { id: number; customerId: number; customerName: string; customerPhone: string; customerAddress: string; billMonth: string; generatedAt: string; totalAmount: number; isPaid: boolean; items: BillItem[]; }
interface BillItem { productName: string; totalQuantity: number; unit: string; pricePerUnit: number; totalPrice: number; }
interface Customer { id: number; name: string; phone: string; isActive: boolean; }

@Component({
  selector: 'app-bills',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, PaginationComponent],
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
            <span class="current-page">🧾 Bills</span>
          </div>
          <div class="ps">Generate monthly bills and download PDFs</div>
        </div>
        <button class="btn btn-primary btn-add-main" (click)="openGen()">
          <span>➕</span> Generate Bill
        </button>
      </header>

      <div class="card filter-bar">
        <div class="search-wrap">
          <span class="search-icon">🔍</span>
          <input type="text" class="form-control pl-icon" placeholder="Search customer name..."
                 [(ngModel)]="search" (ngModelChange)="applyFilter()" />
        </div>
        
        <select class="form-control sel-status" [(ngModel)]="filterPaid" (change)="applyFilter()">
          <option value="all">All Status</option>
          <option value="paid">✅ Paid</option>
          <option value="pending">⏳ Pending</option>
        </select>
        
        <div class="summary-pills">
          <span class="pill pill-p" title="Total Amount">💰 ₹{{ totalAmt | number:'1.0-0' }} (Page)</span>
          <span class="pill pill-r" title="Pending Amount" *ngIf="pendingAmt > 0">🔴 ₹{{ pendingAmt | number:'1.0-0' }} (Page)</span>
        </div>
      </div>

      <div class="card mt">
        <div *ngIf="loading" class="empty state-msg">⏳ Loading bills...</div>
        <div *ngIf="!loading && bills.length === 0" class="empty state-msg">No bills found. Generate a bill first.</div>
        
        <div class="table-wrap" *ngIf="!loading && bills.length > 0">
          <table>
            <thead>
              <tr>
                <th class="w-seq">#</th>
                <th>Customer</th>
                <th>Billing Month</th>
                <th class="hide-xs">Items</th>
                <th>Total</th>
                <th class="hide-sm">Generated</th>
                <th>Status</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let b of bills; let i=index" class="hover-row" [style.background]="b.isPaid ? '#f8fafc' : '#fffbeb'">
                <!-- Calculate correct sequence number based on page -->
                <td><span class="rank">{{ (page - 1) * pageSize + i + 1 }}</span></td>
                <td>
                  <div class="cname">{{ b.customerName }}</div>
                  <div class="csub">{{ b.customerAddress }}</div>
                </td>
                <td><strong class="month-txt">{{ b.billMonth | date:'MMM yyyy' }}</strong></td>
                <td class="hide-xs"><span class="item-badge">{{ b.items.length }} products</span></td>
                <td><strong class="amt">₹{{ b.totalAmount | number:'1.0-0' }}</strong></td>
                <td class="hide-sm"><span class="date-txt">{{ b.generatedAt | date:'dd/MM/yyyy hh:mm a':'Asia/Kolkata' }}</span></td>
                <td>
                  <span class="badge" [class.bs]="b.isPaid" [class.bd]="!b.isPaid">
                    {{ b.isPaid ? 'Paid' : 'Pending' }}
                  </span>
                </td>
                <td>
                  <div class="abts">
                    <button class="action-btn btn-view" title="View Details" (click)="viewBill(b)">👁️</button>
                    <button class="action-btn btn-pdf" title="Download PDF" (click)="downloadPdf(b)" [disabled]="downloading===b.id">
                      {{ downloading===b.id ? '⏳' : '📄' }}
                    </button>
                    <button *ngIf="!b.isPaid" class="action-btn btn-success-light" title="Mark as Paid" (click)="markPaid(b)">✅</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination Component Rendered Here -->
        <div class="pagination-wrapper" *ngIf="!loading && totalPages > 1">
          <app-pagination 
            [currentPage]="page" 
            [totalPages]="totalPages" 
            [totalCount]="totalCount"
            (pageChange)="onPageChange($event)">
          </app-pagination>
        </div>
      </div>
    </div>

    <div class="overlay" *ngIf="showGen" (click)="closeGen()">
      <div class="modal" (click)="$event.stopPropagation()">
        
        <div class="modal-head">
          <h3>➕ Generate Monthly Bill</h3>
          <button class="close-btn" (click)="closeGen()">✕</button>
        </div>

        <div class="modal-body">
          <div class="fg">
            <label>Select Customer <span class="req">*</span></label>
            <select class="form-control" [(ngModel)]="genForm.customerId">
              <option [value]="0" disabled>Select customer...</option>
              <option *ngFor="let c of customers" [value]="c.id">{{ c.name }} – {{ c.phone }}</option>
            </select>
          </div>

          <div class="month-grid mt">
            <div class="fg">
              <label>Billing Month <span class="req">*</span></label>
              <select class="form-control" [(ngModel)]="genForm.month">
                <option *ngFor="let m of months; let i=index" [value]="i+1">{{ m }}</option>
              </select>
            </div>
            <div class="fg">
              <label>Year <span class="req">*</span></label>
              <select class="form-control" [(ngModel)]="genForm.year">
                <option *ngFor="let y of years" [value]="y">{{ y }}</option>
              </select>
            </div>
          </div>

          <div class="info-note">
            ℹ️ This aggregates all delivered daily sales for the selected customer during the specified month.
          </div>
        </div>

        <div class="modal-foot">
          <button class="btn btn-cancel" (click)="closeGen()">Cancel</button>
          <button class="btn btn-primary" (click)="generateBill()" [disabled]="generating || genForm.customerId === 0">
            {{ generating ? '⏳ Generating...' : '🧾 Generate Bill' }}
          </button>
        </div>

      </div>
    </div>

    <div class="overlay" *ngIf="selectedBill" (click)="closeView()">
      <div class="modal modal-lg receipt-modal" (click)="$event.stopPropagation()">
        
        <div class="modal-head">
          <h3>🧾 Digital Receipt</h3>
          <button class="close-btn" (click)="closeView()">✕</button>
        </div>

        <div class="modal-body">
          <div class="bill-info">
            <div class="bi-header">
              <div class="bi-title">Invoice</div>
              <span class="badge" [class.bs]="selectedBill.isPaid" [class.bd]="!selectedBill.isPaid">
                {{ selectedBill.isPaid ? 'PAID' : 'PENDING' }}
              </span>
            </div>
            <div class="bi-grid">
              <div class="bi-col">
                <span class="bi-lbl">Billed To:</span>
                <strong class="bi-val">{{ selectedBill.customerName }}</strong>
                <span class="bi-sub">📞 {{ selectedBill.customerPhone }}</span>
                <span class="bi-sub">{{ selectedBill.customerAddress }}</span>
              </div>
              <div class="bi-col text-right-desktop">
                <span class="bi-lbl">Billing Period:</span>
                <strong class="bi-val text-cyan">{{ selectedBill.billMonth | date:'MMMM yyyy' }}</strong>
                <span class="bi-lbl mt-half">Generated On:</span>
                <span class="bi-sub">{{ selectedBill.generatedAt | date:'dd/MM/yyyy hh:mm a':'Asia/Kolkata' }}</span>
              </div>
            </div>
          </div>

          <div class="table-wrap receipt-table-wrap mt">
            <table class="bill-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Unit</th>
                  <th class="text-right">Rate</th>
                  <th class="text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let item of selectedBill.items">
                  <td><strong>{{ item.productName }}</strong></td>
                  <td>{{ item.totalQuantity | number:'1.2-2' }}</td>
                  <td>{{ item.unit }}</td>
                  <td class="text-right">₹{{ item.pricePerUnit | number:'1.2-2' }}</td>
                  <td class="text-right amt">₹{{ item.totalPrice | number:'1.2-2' }}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr class="total-row">
                  <td colspan="4" class="text-right">GRAND TOTAL</td>
                  <td class="text-right grand-amt">₹ {{ selectedBill.totalAmount | number:'1.2-2' }}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div class="modal-foot">
          <button class="btn btn-cancel" (click)="closeView()">Close</button>
          <div class="foot-actions">
            <button *ngIf="!selectedBill.isPaid" class="btn btn-success" (click)="markPaid(selectedBill); closeView()">✅ Mark Paid</button>
            <button class="btn btn-primary" (click)="downloadPdf(selectedBill)" [disabled]="downloading===selectedBill.id">
              {{ downloading===selectedBill.id ? '⏳ Downloading...' : '📄 Download PDF' }}
            </button>
          </div>
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
    .req { color: #ef4444; }

    /* Header & Navigation */
    .ph { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; gap: 1rem; flex-wrap: wrap; }
    
    .breadcrumb { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
    .brand-link { font-family: 'Poppins', sans-serif; font-size: 1rem; font-weight: 700; color: #0891b2; text-decoration: none; transition: color 0.2s; }
    .brand-link:hover { color: #0e7490; text-decoration: underline; }
    .divider { color: #cbd5e1; font-weight: 600; }
    .current-page { font-family: 'Poppins', sans-serif; font-size: 1.2rem; font-weight: 800; color: #0f172a; }
    .ps { color: #64748b; font-size: 0.85rem; }

    /* Cards & Filters */
    .card { background: #fff; border-radius: 12px; padding: 1.25rem; box-shadow: 0 2px 8px rgba(0,0,0,0.04); margin-bottom: 1rem; }
    .filter-bar { display: flex; gap: 1rem; align-items: center; flex-wrap: wrap; }
    
    .search-wrap { position: relative; flex: 1; min-width: 200px; }
    .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); font-size: 0.9rem; opacity: 0.6; }
    .pl-icon { padding-left: 2.2rem !important; }
    
    .form-control { 
      width: 100%; padding: 0.6rem 0.85rem; border: 1px solid #cbd5e1; 
      border-radius: 8px; font-size: 0.9rem; font-family: inherit; color: #0f172a; 
      transition: border-color 0.2s, box-shadow 0.2s; outline: none; background: #fff;
    }
    .form-control:focus { border-color: #0891b2; box-shadow: 0 0 0 3px rgba(8,145,178,0.1); }
    .sel-status { width: 140px; flex-shrink: 0; cursor: pointer; }

    .summary-pills { display: flex; gap: 0.5rem; margin-left: auto; flex-wrap: wrap; }
    .pill { padding: 0.4rem 0.8rem; border-radius: 20px; font-size: 0.8rem; font-weight: 700; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
    .pill-p { background: #f0f9ff; color: #0369a1; border: 1px solid #bae6fd; }
    .pill-r { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }

    /* Main Table */
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
    .month-txt { color: #0e7490; background: #f0f9ff; padding: 0.2rem 0.5rem; border-radius: 6px; }
    .item-badge { background: #f1f5f9; color: #475569; padding: 0.2rem 0.5rem; border-radius: 6px; font-size: 0.75rem; font-weight: 600; }
    .date-txt { color: #64748b; font-size: 0.8rem; }
    .amt { color: #0f172a; font-size: 0.95rem; font-weight: 800; }

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
    .action-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
    .action-btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn-view:hover { background: #e0f2fe; color: #0284c7; border-color: #bae6fd; }
    .btn-pdf:hover { background: #f3e8ff; color: #7e22ce; border-color: #d8b4fe; }
    .btn-success-light:hover { background: #d1fae5; color: #059669; border-color: #a7f3d0; }

    .btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 0.6rem 1.2rem; border-radius: 10px; border: none; cursor: pointer; font-weight: 600; font-size: 0.9rem; transition: all 0.2s; font-family: inherit; }
    .btn-primary { background: #0891b2; color: #fff; box-shadow: 0 2px 4px rgba(8,145,178,0.2); }
    .btn-primary:hover:not(:disabled) { background: #0e7490; transform: translateY(-1px); }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
    
    .btn-success { background: #10b981; color: #fff; box-shadow: 0 2px 4px rgba(16,185,129,0.2); }
    .btn-success:hover { background: #059669; transform: translateY(-1px); }
    
    .btn-cancel { background: #f1f5f9; color: #475569; border: 1px solid #e2e8f0; }
    .btn-cancel:hover { background: #e2e8f0; }

    .state-msg { padding: 3rem 1rem; font-weight: 500; font-size: 0.95rem; text-align: center; color: #64748b; }

    /* Pagination */
    .pagination-wrapper {
      padding: 1rem 1rem 0 1rem;
      border-top: 1px solid #f1f5f9;
      display: flex;
      justify-content: flex-end;
      margin-top: 0.5rem;
    }

    /* Modals */
    .overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.6); backdrop-filter: blur(2px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 1rem; }
    .modal { background: #fff; border-radius: 16px; width: 100%; max-width: 520px; max-height: 90vh; display: flex; flex-direction: column; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); }
    .modal-lg { max-width: 650px; }
    
    .modal-head { display: flex; justify-content: space-between; align-items: center; padding: 1.25rem 1.5rem; border-bottom: 1px solid #f1f5f9; }
    .modal-head h3 { margin: 0; font-size: 1.1rem; font-family: 'Poppins', sans-serif; color: #0f172a; }
    
    .close-btn { background: #f1f5f9; border: none; border-radius: 50%; width: 32px; height: 32px; cursor: pointer; font-size: 1rem; color: #64748b; display: flex; align-items: center; justify-content: center; transition: background 0.2s; }
    .close-btn:hover { background: #fee2e2; color: #ef4444; }

    .modal-body { padding: 1.5rem; overflow-y: auto; flex-grow: 1; }
    .modal-foot { display: flex; justify-content: flex-end; gap: 0.75rem; padding: 1.25rem 1.5rem; border-top: 1px solid #e2e8f0; background: #f8fafc; border-radius: 0 0 16px 16px; flex-wrap: wrap; }
    .foot-actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }

    /* Form specific */
    .fg { margin-bottom: 1rem; }
    .fg label { display: block; font-weight: 600; font-size: 0.85rem; color: #475569; margin-bottom: 0.5rem; }
    .month-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .info-note { background: #f0f9ff; color: #0369a1; border-left: 4px solid #0891b2; border-radius: 4px 8px 8px 4px; padding: 0.8rem 1rem; font-size: 0.85rem; margin-top: 1rem; }

    /* Receipt Details Styling */
    .receipt-modal .modal-body { padding: 0; background: #f8fafc; }
    .bill-info { padding: 1.5rem; background: #fff; border-bottom: 1px dashed #cbd5e1; }
    .bi-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    .bi-title { font-size: 1.5rem; font-weight: 800; font-family: 'Poppins', sans-serif; color: #0f172a; text-transform: uppercase; letter-spacing: 1px; }
    
    .bi-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
    .bi-col { display: flex; flex-direction: column; gap: 0.2rem; }
    .text-right-desktop { text-align: right; }
    .bi-lbl { font-size: 0.75rem; color: #64748b; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px; }
    .bi-val { font-size: 1rem; color: #0f172a; }
    .bi-sub { font-size: 0.8rem; color: #475569; }
    .text-cyan { color: #0891b2; }
    
    .receipt-table-wrap { margin: 1.5rem; border: 1px solid #e2e8f0; background: #fff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.02); }
    .bill-table th { background: #f8fafc; color: #475569; }
    .bill-table td { border-bottom: 1px solid #f1f5f9; }
    .total-row td { background: #0f172a; color: #fff; font-weight: 700; font-size: 0.9rem; padding: 1rem; }
    .grand-amt { font-size: 1.1rem !important; color: #38bdf8 !important; }

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
      .hide-sm { display: none; }
      .text-right { text-align: left; }
      .text-right-desktop { text-align: left; }
      .abts { justify-content: flex-start; }
    }

    /* Standard Phones (< 600px) */
    @media (max-width: 600px) {
      .ph { flex-direction: column; align-items: stretch; }
      .btn-add-main { width: 100%; justify-content: center; padding: 0.8rem; }
      
      .filter-bar { flex-direction: column; align-items: stretch; }
      .summary-pills { margin-left: 0; justify-content: flex-start; }
      .sel-status { width: 100%; }
      
      th, td { padding: 0.6rem; font-size: 0.8rem; }
      .cname { font-size: 0.85rem; }
      
      .modal-body { padding: 1.25rem; }
      .month-grid { grid-template-columns: 1fr; gap: 0; }
      
      .bi-grid { grid-template-columns: 1fr; gap: 1rem; }
      .receipt-table-wrap { margin: 1rem; }
      
      .modal-foot { flex-direction: column-reverse; }
      .foot-actions { width: 100%; flex-direction: column; }
      .modal-foot .btn { width: 100%; justify-content: center; }
    }

    /* Fold Outer Screen (~280px - 360px) */
    @media (max-width: 380px) {
      .hide-xs { display: none; }
      .card { padding: 0.85rem; }
      .current-page { font-size: 1rem; }
      
      .pill { flex: 1; text-align: center; }
      .action-btn { width: 28px; height: 28px; font-size: 0.8rem; }
      
      .bi-title { font-size: 1.2rem; }
      .receipt-table-wrap { margin: 0.5rem; }
    }
  `]
})
export class BillsComponent implements OnInit {
  bills: Bill[] = [];
  customers: Customer[] = [];
  
  loading = false; 
  generating = false; 
  downloading: number | null = null;
  
  showGen = false; 
  selectedBill: Bill | null = null;
  search = ''; 
  filterPaid = 'all';
  toasts: { msg: string; type: string }[] = [];

  // Pagination State
  page = 1;
  pageSize = 10;
  totalCount = 0;
  totalPages = 0;

  months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  years  = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);
  genForm = { customerId: 0, month: new Date().getMonth() + 1, year: new Date().getFullYear() };

  // Note: These calculations reflect the data on the CURRENT PAGE only
  get totalAmt()   { return this.bills.reduce((s, b) => s + b.totalAmount, 0); }
  get pendingAmt() { return this.bills.filter(b => !b.isPaid).reduce((s, b) => s + b.totalAmount, 0); }

  constructor(private http: HttpClient) {}

  ngOnInit() { 
    this.load(); 
    this.loadCustomers(); 
  }

  load() {
    this.loading = true;
    
    // Construct base URL with pagination
    let url = `${environment.apiUrl}/Bill?page=${this.page}&pageSize=${this.pageSize}`;
    
    // Append filters to API request
    if (this.search) {
      url += `&search=${encodeURIComponent(this.search)}`;
    }
    if (this.filterPaid !== 'all') {
      url += `&status=${this.filterPaid}`;
    }

    this.http.get<any>(url).subscribe({
      next: (res) => { 
        // Mapping paginated server response correctly
        this.bills = res.data || []; 
        this.totalCount = res.totalCount || 0;
        this.totalPages = res.totalPages || 0;
        this.loading = false; 
      },
      error: () => { 
        this.loading = false; 
        this.toast('Failed to load bills. Please check connection.', 'error'); 
      }
    });
  }

  // Called when PaginationComponent emits a page change
  onPageChange(p: number) {
    this.page = p;
    this.load();
  }

  // Called when search input or status dropdown changes
  applyFilter() {
    this.page = 1; // Reset to page 1 whenever filters change
    this.load();   // Reload from server
  }

  loadCustomers() {
    this.http.get<Customer[]>(`${environment.apiUrl}/Customer`).subscribe({
      next: (d) => this.customers = d.filter(c => c.isActive)
    });
  }

  openGen() {
    this.showGen = true;
    document.body.style.overflow = 'hidden';
  }

  closeGen() {
    this.showGen = false;
    document.body.style.overflow = 'auto';
  }

  viewBill(b: Bill) { 
    this.selectedBill = b; 
    document.body.style.overflow = 'hidden';
  }
  
  closeView() {
    this.selectedBill = null;
    document.body.style.overflow = 'auto';
  }

  generateBill() {
    if (!this.genForm.customerId) { 
      this.toast('Please select a customer first.', 'error'); 
      return; 
    }
    
    this.generating = true;
    this.http.post<Bill>(`${environment.apiUrl}/Bill/generate`, this.genForm).subscribe({
      next: () => { 
        this.generating = false; 
        this.closeGen(); 
        this.load(); // Refresh current page to see new bill
        this.toast('Bill generated successfully!', 'success'); 
      },
      error: () => { 
        this.generating = false; 
        this.toast('Failed to generate bill.', 'error'); 
      }
    });
  }

  markPaid(b: Bill) {
    this.http.patch(`${environment.apiUrl}/Bill/${b.id}/mark-paid`, {}).subscribe({
      next: () => { 
        this.load(); // Refresh the list
        this.toast('Bill marked as paid!', 'success'); 
      },
      error: () => this.toast('Failed to update status.', 'error')
    });
  }

  downloadPdf(b: Bill) {
    this.downloading = b.id;
    this.http.get(`${environment.apiUrl}/Bill/${b.id}/pdf`, {
      responseType: 'blob', observe: 'response'
    }).subscribe({
      next: response => {
        const blob = response.body!;
        if (blob.type === 'application/json' || blob.size === 0) {
          this.downloading = null;
          this.toast('PDF generation failed on server.', 'error');
          return;
        }
        
        const monthDate = new Date(b.billMonth);
        const monthLabel = isNaN(monthDate.getTime()) ? b.billMonth : monthDate.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
        const url = URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
        const a = document.createElement('a');
        
        a.href = url;
        a.download = `Invoice_${b.customerName}_${monthLabel}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        this.downloading = null;
        this.toast('PDF downloaded successfully!', 'success');
      },
      error: err => {
        this.downloading = null;
        if (err.error instanceof Blob) {
          err.error.text().then((text: string) => this.toast(`PDF failed: ${text}`, 'error'));
        } else {
          this.toast(`PDF download failed: ${err.status}`, 'error');
        }
      }
    });
  }

  toast(msg: string, type: 'success' | 'error') {
    const t = { msg, type };
    this.toasts.push(t);
    setTimeout(() => {
      const index = this.toasts.indexOf(t);
      if (index > -1) this.toasts.splice(index, 1);
    }, 3500);
  }
}