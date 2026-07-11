// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { HttpClient } from '@angular/common/http';
// import { environment } from '../../../environments/environment';

// interface Product { id: number; name: string; pricePerUnit: number; unit: string; }
// interface CustomerProduct { productId: number; productName: string; quantity: number; unit: string; }
// interface Customer { id: number; name: string; phone: string; address: string; email: string; isActive: boolean; createdAt: string; products: CustomerProduct[]; }

// @Component({
//   selector: 'app-customers',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   template: `
//     <div class="toast-container">
//       <div *ngFor="let t of toasts" class="toast" [class]="'toast-'+t.type">{{ t.msg }}</div>
//     </div>

//     <div class="ph">
//       <div><div class="pt">👥 Customers</div><div class="ps">{{ customers.length }} registered</div></div>
//       <button class="btn btn-primary" (click)="openAdd()">➕ Add</button>
//     </div>

//     <div class="card filter-bar">
//       <input type="text" class="form-control" placeholder="🔍 Search name, phone..."
//              [(ngModel)]="search" (input)="applyFilter()" />
//       <select class="form-control sel-status" [(ngModel)]="filterStatus" (change)="applyFilter()">
//         <option value="all">All</option>
//         <option value="active">Active</option>
//         <option value="inactive">Inactive</option>
//       </select>
//     </div>

//     <div class="card">
//       <div *ngIf="loading" class="empty">⏳ Loading...</div>
//       <div *ngIf="!loading && filtered.length===0" class="empty">No customers found</div>
//       <div class="table-wrap" *ngIf="!loading && filtered.length>0">
//         <table>
//           <thead>
//             <tr>
//               <th>#</th>
//               <th>Name</th>
//               <th>Phone</th>
//               <th class="hide-xs">Address</th>
//               <th>Products</th>
//               <th>Status</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             <tr *ngFor="let c of filtered; let i=index">
//               <td>{{ i+1 }}</td>
//               <td>
//                 <div class="cname">{{ c.name }}</div>
//                 <div class="cemail">{{ c.email }}</div>
//               </td>
//               <td>{{ c.phone }}</td>
//               <td class="hide-xs">{{ c.address }}</td>
//               <td>
//                 <div class="ptags">
//                   <span *ngFor="let p of c.products" class="ptag">{{ p.productName }} {{ p.quantity }}{{ p.unit }}</span>
//                   <span *ngIf="!c.products?.length" class="muted">None</span>
//                 </div>
//               </td>
//               <td>
//                 <span class="badge" [class.bs]="c.isActive" [class.bd]="!c.isActive">
//                   {{ c.isActive ? 'Active' : 'Inactive' }}
//                 </span>
//               </td>
//               <td>
//                 <div class="abts">
//                   <button class="btn btn-sm btn-outline" (click)="openEdit(c)">✏️</button>
//                   <button class="btn btn-sm" [class.btn-warning]="c.isActive" [class.btn-success]="!c.isActive" (click)="toggle(c)">
//                     {{ c.isActive ? '⏸️' : '▶️' }}
//                   </button>
//                   <button class="btn btn-sm btn-danger" (click)="delete(c)">🗑️</button>
//                 </div>
//               </td>
//             </tr>
//           </tbody>
//         </table>
//       </div>
//     </div>

//     <!-- Modal -->
//     <div class="overlay" *ngIf="showModal" (click)="showModal=false">
//       <div class="modal" (click)="$event.stopPropagation()">
//         <div class="modal-head">
//           <h3>{{ editId ? '✏️ Edit Customer' : '➕ Add Customer' }}</h3>
//           <button class="close-btn" (click)="showModal=false">✕</button>
//         </div>
//         <form (ngSubmit)="save()">
//           <div class="form-grid">
//             <div class="fg"><label>Name *</label><input type="text" [(ngModel)]="form.name" name="name" required placeholder="Full name" /></div>
//             <div class="fg"><label>Phone *</label><input type="tel" [(ngModel)]="form.phone" name="phone" required placeholder="Phone number" /></div>
//             <div class="fg"><label>Email</label><input type="email" [(ngModel)]="form.email" name="email" placeholder="Email address" /></div>
//             <div class="fg"><label>Address *</label><input type="text" [(ngModel)]="form.address" name="address" required placeholder="Full address" /></div>
//           </div>
//           <div class="prod-section">
//             <div class="prod-head">
//               <label>📦 Daily Products</label>
//               <button type="button" class="btn btn-sm btn-outline" (click)="addProduct()">+ Add</button>
//             </div>
//             <div *ngIf="!form.products.length" class="empty" style="padding:.75rem">Click Add to assign products</div>
//             <div class="prod-row" *ngFor="let p of form.products; let i=index">
//               <select [(ngModel)]="p.productId" [name]="'pid'+i" required>
//                 <option [value]="0" disabled>Select product</option>
//                 <option *ngFor="let pr of products" [value]="pr.id">{{ pr.name }} ({{ pr.unit }}) - ₹{{ pr.pricePerUnit }}</option>
//               </select>
//               <input type="number" [(ngModel)]="p.quantity" [name]="'qty'+i" placeholder="Qty" min="0.1" step="0.1" required />
//               <button type="button" class="btn btn-sm btn-danger" (click)="removeProduct(i)">✕</button>
//             </div>
//           </div>
//           <div class="modal-foot">
//             <button type="button" class="btn btn-outline" (click)="showModal=false">Cancel</button>
//             <button type="submit" class="btn btn-primary" [disabled]="saving">
//               {{ saving ? '⏳ Saving...' : (editId ? '💾 Update' : '✅ Add') }}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   `,
//   styles: [`
//     :host { display:block; }

//     .ph { display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; gap:.5rem; flex-wrap:wrap; }
//     .pt { font-family:'Poppins',sans-serif; font-size:1.2rem; font-weight:700; }
//     .ps { color:#64748b; font-size:.78rem; }

//     .filter-bar { display:flex; gap:.75rem; margin-bottom:1rem; padding:.75rem 1rem; flex-wrap:wrap; }
//     .card { background:#fff; border-radius:12px; padding:1rem 1.25rem; box-shadow:0 1px 3px rgba(0,0,0,.07); }

//     .form-control { width:100%; padding:.5rem .85rem; border:1.5px solid #e2e8f0; border-radius:8px; font-size:.88rem; outline:none; box-sizing:border-box; }
//     .form-control:focus { border-color:#0891b2; }
//     .sel-status { width:130px; flex-shrink:0; }

//     .table-wrap { overflow-x:auto; -webkit-overflow-scrolling:touch; }
//     table { width:100%; border-collapse:collapse; min-width:480px; }
//     th { padding:.5rem .65rem; text-align:left; font-size:.7rem; font-weight:700; color:#0e7490; background:#f0f9ff; text-transform:uppercase; white-space:nowrap; }
//     td { padding:.55rem .65rem; border-bottom:1px solid #f1f5f9; font-size:.82rem; vertical-align:top; }
//     tr:last-child td { border-bottom:none; }

//     .cname { font-weight:700; }
//     .cemail { font-size:.72rem; color:#64748b; }
//     .ptags { display:flex; flex-wrap:wrap; gap:.25rem; }
//     .ptag { background:#e0f2fe; color:#0369a1; padding:.1rem .4rem; border-radius:4px; font-size:.7rem; font-weight:600; }
//     .muted { color:#94a3b8; font-size:.78rem; }

//     .badge { display:inline-block; padding:.15rem .5rem; border-radius:10px; font-size:.7rem; font-weight:700; }
//     .bs { background:#d1fae5; color:#065f46; }
//     .bd { background:#fee2e2; color:#991b1b; }

//     .abts { display:flex; gap:.3rem; flex-wrap:wrap; }
//     .btn { display:inline-flex; align-items:center; gap:.25rem; padding:.4rem .8rem; border-radius:8px; border:none; cursor:pointer; font-weight:700; font-size:.8rem; white-space:nowrap; }
//     .btn-primary { background:#0891b2; color:#fff; }
//     .btn-outline { background:transparent; color:#0891b2; border:1.5px solid #0891b2; }
//     .btn-danger  { background:#ef4444; color:#fff; }
//     .btn-warning { background:#f59e0b; color:#fff; }
//     .btn-success { background:#10b981; color:#fff; }
//     .btn-sm { padding:.3rem .6rem; font-size:.75rem; }
//     .btn:disabled { opacity:.6; cursor:not-allowed; }
//     .empty { text-align:center; padding:1.5rem; color:#94a3b8; font-size:.85rem; }

//     /* Modal */
//     .overlay { position:fixed; inset:0; background:rgba(0,0,0,.45); display:flex; align-items:center; justify-content:center; z-index:1000; padding:1rem; }
//     .modal { background:#fff; border-radius:14px; padding:1.5rem; width:100%; max-width:560px; max-height:90vh; overflow-y:auto; }
//     .modal-head { display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem; }
//     .modal-head h3 { margin:0; font-size:1rem; font-weight:700; }
//     .close-btn { background:none; border:none; cursor:pointer; font-size:1.1rem; color:#64748b; padding:4px; }
//     .close-btn:hover { color:#ef4444; }

//     .form-grid { display:grid; grid-template-columns:1fr 1fr; gap:0 1rem; }
//     .fg { margin-bottom:.9rem; }
//     .fg label { display:block; font-weight:700; font-size:.75rem; color:#64748b; margin-bottom:.3rem; }
//     .fg input { width:100%; padding:.5rem .85rem; border:1.5px solid #e2e8f0; border-radius:8px; font-size:.85rem; outline:none; box-sizing:border-box; }
//     .fg input:focus { border-color:#0891b2; }

//     .prod-section { border-top:1px solid #e2e8f0; padding-top:.9rem; margin-top:.25rem; }
//     .prod-head { display:flex; justify-content:space-between; align-items:center; margin-bottom:.65rem; }
//     .prod-head label { font-weight:700; font-size:.85rem; }
//     .prod-row { display:flex; gap:.4rem; align-items:center; margin-bottom:.4rem; }
//     .prod-row select { flex:1; padding:.45rem .7rem; border:1.5px solid #e2e8f0; border-radius:8px; font-size:.82rem; outline:none; min-width:0; }
//     .prod-row input { width:75px; padding:.45rem .6rem; border:1.5px solid #e2e8f0; border-radius:8px; font-size:.82rem; outline:none; flex-shrink:0; }

//     .modal-foot { display:flex; justify-content:flex-end; gap:.65rem; margin-top:1.25rem; padding-top:.9rem; border-top:1px solid #e2e8f0; }

//     .toast-container { position:fixed; top:1rem; right:1rem; z-index:2000; display:flex; flex-direction:column; gap:.4rem; }
//     .toast { padding:.55rem 1rem; border-radius:9px; font-weight:700; font-size:.82rem; color:#fff; }
//     .toast-success { background:#10b981; }
//     .toast-error { background:#ef4444; }

//     /* Responsive */
//     @media(max-width:600px) {
//       .form-grid { grid-template-columns:1fr; }
//       .pt { font-size:1rem; }
//       .filter-bar { flex-direction:column; }
//       .sel-status { width:100%; }
//     }

//     @media(max-width:480px) {
//       .hide-xs { display:none; }
//       .prod-row input { width:60px; }
//     }

//     @media(max-width:360px) {
//       .btn-sm { padding:.25rem .45rem; font-size:.72rem; }
//       .abts { gap:.2rem; }
//     }
//   `]
// })
// export class CustomersComponent implements OnInit {
//   customers: Customer[] = [];
//   filtered:  Customer[] = [];
//   products:  Product[]  = [];
//   loading = false; saving = false; showModal = false;
//   search = ''; filterStatus = 'all'; editId: number | null = null;
//   toasts: { msg: string; type: string }[] = [];
//   form = this.emptyForm();

//   constructor(private http: HttpClient) {}

//   ngOnInit() { this.loadCustomers(); this.loadProducts(); }

//   loadCustomers() {
//     this.loading = true;
//     this.http.get<Customer[]>(`${environment.apiUrl}/Customer`).subscribe({
//       next: d  => { this.customers = d; this.applyFilter(); this.loading = false; },
//       error: () => { this.loading = false; this.toast('Failed to load customers', 'error'); }
//     });
//   }

//   loadProducts() {
//     this.http.get<Product[]>(`${environment.apiUrl}/Product`).subscribe({
//       next: d => this.products = d
//     });
//   }

//   applyFilter() {
//     let list = [...this.customers];
//     if (this.search) list = list.filter(c =>
//       c.name.toLowerCase().includes(this.search.toLowerCase()) || c.phone.includes(this.search));
//     if (this.filterStatus === 'active')   list = list.filter(c => c.isActive);
//     if (this.filterStatus === 'inactive') list = list.filter(c => !c.isActive);
//     this.filtered = list;
//   }

//   openAdd()  { this.editId = null; this.form = this.emptyForm(); this.showModal = true; }

//   openEdit(c: Customer) {
//     this.editId = c.id;
//     this.form = { name: c.name, phone: c.phone, address: c.address, email: c.email,
//       products: c.products.map(p => ({ productId: p.productId, quantity: p.quantity })) };
//     this.showModal = true;
//   }

//   save() {
//     this.saving = true;
//     const url = this.editId ? `${environment.apiUrl}/Customer/${this.editId}` : `${environment.apiUrl}/Customer`;
//     const req  = this.editId ? this.http.put(url, this.form) : this.http.post(url, this.form);
//     req.subscribe({
//       next: () => { this.showModal = false; this.saving = false; this.loadCustomers(); this.toast(this.editId ? 'Updated!' : 'Added!', 'success'); },
//       error: () => { this.saving = false; this.toast('Failed to save', 'error'); }
//     });
//   }

//   toggle(c: Customer) {
//     this.http.patch(`${environment.apiUrl}/Customer/${c.id}/toggle`, {}).subscribe({
//       next: () => { this.loadCustomers(); this.toast('Status updated', 'success'); },
//       error: () => this.toast('Failed', 'error')
//     });
//   }

//   delete(c: Customer) {
//     if (!confirm(`Delete "${c.name}"?`)) return;
//     this.http.delete(`${environment.apiUrl}/Customer/${c.id}`).subscribe({
//       next: () => { this.loadCustomers(); this.toast('Deleted', 'success'); },
//       error: () => this.toast('Failed to delete', 'error')
//     });
//   }

//   addProduct()             { this.form.products.push({ productId: 0, quantity: 1 }); }
//   removeProduct(i: number) { this.form.products.splice(i, 1); }
//   emptyForm()              { return { name:'', phone:'', address:'', email:'', products: [] as {productId:number;quantity:number}[] }; }

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

interface Product { id: number; name: string; pricePerUnit: number; unit: string; }
interface CustomerProduct { productId: number; productName: string; quantity: number; unit: string; }
interface Customer { id: number; name: string; phone: string; address: string; email: string; isActive: boolean; createdAt: string; products: CustomerProduct[]; }

@Component({
  selector: 'app-customers',
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
            <span class="current-page">👥 Customers</span>
          </div>
          <div class="ps">{{ customers.length }} registered customers</div>
        </div>
        <button class="btn btn-primary btn-add-main" (click)="openAdd()">
          <span>➕</span> Add Customer
        </button>
      </header>

      <div class="card filter-bar">
        <div class="search-wrap">
          <span class="search-icon">🔍</span>
          <input type="text" class="form-control pl-icon" placeholder="Search name, phone, email..."
                 [(ngModel)]="search" (input)="applyFilter()" />
        </div>
        <select class="form-control sel-status" [(ngModel)]="filterStatus" (change)="applyFilter()">
          <option value="all">Status: All</option>
          <option value="active">🟢 Active</option>
          <option value="inactive">🔴 Inactive</option>
        </select>
      </div>

      <div class="card mt">
        <div *ngIf="loading" class="empty state-msg">⏳ Loading customers...</div>
        <div *ngIf="!loading && filtered.length === 0" class="empty state-msg">No customers found.</div>
        
        <div class="table-wrap" *ngIf="!loading && filtered.length > 0">
          <table>
            <thead>
              <tr>
                <th class="w-seq">#</th>
                <th>Customer Info</th>
                <th>Contact</th>
                <th class="hide-xs">Address</th>
                <th>Daily Products</th>
                <th>Status</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let c of filtered; let i=index" class="hover-row">
                <td><span class="rank">{{ i+1 }}</span></td>
                <td>
                  <div class="cname">{{ c.name }}</div>
                  <div class="cemail" *ngIf="c.email">{{ c.email }}</div>
                </td>
                <td>
                  <div class="cphone">📞 {{ c.phone }}</div>
                </td>
                <td class="hide-xs"><span class="address-txt">{{ c.address || '—' }}</span></td>
                <td>
                  <div class="ptags">
                    <span *ngFor="let p of c.products" class="ptag" title="{{p.productName}}">
                      {{ p.productName }} <span class="qty-badge">{{ p.quantity }}{{ p.unit }}</span>
                    </span>
                    <span *ngIf="!c.products?.length" class="muted">No products assigned</span>
                  </div>
                </td>
                <td>
                  <span class="badge" [class.bs]="c.isActive" [class.bd]="!c.isActive">
                    {{ c.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td>
                  <div class="abts">
                    <button class="action-btn btn-edit" title="Edit" (click)="openEdit(c)">✏️</button>
                    <button class="action-btn" title="Toggle Status" 
                            [class.btn-warning]="c.isActive" [class.btn-success]="!c.isActive" 
                            (click)="toggle(c)">
                      {{ c.isActive ? '⏸️' : '▶️' }}
                    </button>
                    <button class="action-btn btn-delete" title="Delete" (click)="delete(c)">🗑️</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="overlay" *ngIf="showModal" (click)="closeModal()">
      <div class="modal" (click)="$event.stopPropagation()">
        <div class="modal-head">
          <h3>{{ editId ? '✏️ Edit Customer' : '➕ Add New Customer' }}</h3>
          <button class="close-btn" (click)="closeModal()">✕</button>
        </div>
        
        <form (ngSubmit)="save()" class="modal-body">
          <div class="form-grid">
            <div class="fg">
              <label>Full Name <span class="req">*</span></label>
              <input type="text" [(ngModel)]="form.name" name="name" required placeholder="e.g. John Doe" />
            </div>
            <div class="fg">
              <label>Phone Number <span class="req">*</span></label>
              <input type="tel" [(ngModel)]="form.phone" name="phone" required placeholder="e.g. 9876543210" />
            </div>
            <div class="fg">
              <label>Email Address</label>
              <input type="email" [(ngModel)]="form.email" name="email" placeholder="Optional" />
            </div>
            <div class="fg">
              <label>Delivery Address <span class="req">*</span></label>
              <input type="text" [(ngModel)]="form.address" name="address" required placeholder="House No, Street, Area" />
            </div>
          </div>

          <div class="prod-section">
            <div class="prod-head">
              <label>📦 Assigned Daily Products</label>
              <button type="button" class="btn btn-sm btn-outline-add" (click)="addProduct()">+ Add Product</button>
            </div>
            
            <div *ngIf="!form.products.length" class="empty-box">No products assigned yet. Click add to begin.</div>
            
            <div class="prod-row" *ngFor="let p of form.products; let i=index">
              <div class="prod-input-group">
                <select [(ngModel)]="p.productId" [name]="'pid'+i" required>
                  <option [value]="0" disabled>Select product...</option>
                  <option *ngFor="let pr of products" [value]="pr.id">{{ pr.name }} ({{ pr.unit }}) - ₹{{ pr.pricePerUnit }}</option>
                </select>
                <input type="number" [(ngModel)]="p.quantity" [name]="'qty'+i" placeholder="Qty" min="0.1" step="0.1" required />
              </div>
              <button type="button" class="btn-remove" title="Remove" (click)="removeProduct(i)">✕</button>
            </div>
          </div>

          <div class="modal-foot">
            <button type="button" class="btn btn-cancel" (click)="closeModal()">Cancel</button>
            <button type="submit" class="btn btn-primary" [disabled]="saving || !form.name || !form.phone || !form.address">
              {{ saving ? '⏳ Saving...' : (editId ? '💾 Save Changes' : '✅ Create Customer') }}
            </button>
          </div>
        </form>
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

    /* Header & Navigation */
    .ph { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; gap: 1rem; flex-wrap: wrap; }
    
    .breadcrumb { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
    .brand-link { font-family: 'Poppins', sans-serif; font-size: 1rem; font-weight: 700; color: #0891b2; text-decoration: none; transition: color 0.2s; }
    .brand-link:hover { color: #0e7490; text-decoration: underline; }
    .divider { color: #cbd5e1; font-weight: 600; }
    .current-page { font-family: 'Poppins', sans-serif; font-size: 1.2rem; font-weight: 800; color: #0f172a; }
    .ps { color: #64748b; font-size: 0.85rem; }

    /* Filter Bar */
    .filter-bar { display: flex; gap: 1rem; margin-bottom: 1.25rem; align-items: center; flex-wrap: wrap; }
    .search-wrap { position: relative; flex: 1; min-width: 250px; }
    .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); font-size: 0.9rem; opacity: 0.6; }
    .pl-icon { padding-left: 2.2rem !important; }
    
    .form-control { 
      width: 100%; padding: 0.6rem 0.85rem; border: 1px solid #cbd5e1; 
      border-radius: 10px; font-size: 0.9rem; font-family: inherit; color: #0f172a; 
      transition: border-color 0.2s, box-shadow 0.2s; 
    }
    .form-control:focus { outline: none; border-color: #0891b2; box-shadow: 0 0 0 3px rgba(8,145,178,0.1); }
    .sel-status { width: 160px; flex-shrink: 0; background-color: #f8fafc; cursor: pointer; }

    /* Cards */
    .card { background: #fff; border-radius: 12px; padding: 1.25rem; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }

    /* Table */
    .table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; border-radius: 8px; border: 1px solid #f1f5f9; }
    table { width: 100%; border-collapse: collapse; min-width: 700px; text-align: left; }
    th { padding: 0.85rem 1rem; font-size: 0.75rem; font-weight: 700; color: #64748b; background: #f8fafc; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e2e8f0; }
    td { padding: 0.85rem 1rem; border-bottom: 1px solid #f1f5f9; font-size: 0.85rem; vertical-align: middle; }
    .hover-row:hover td { background: #f8fafc; }
    tr:last-child td { border-bottom: none; }
    
    .w-seq { width: 40px; }
    .rank { display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; background: #e0f2fe; color: #0e7490; border-radius: 50%; font-size: 0.75rem; font-weight: 700; }
    
    .cname { font-weight: 700; color: #0f172a; font-size: 0.95rem; }
    .cemail { font-size: 0.75rem; color: #64748b; margin-top: 2px; }
    .cphone { font-weight: 500; font-size: 0.85rem; color: #334155; white-space: nowrap; }
    .address-txt { color: #475569; font-size: 0.8rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    
    /* Product Tags */
    .ptags { display: flex; flex-wrap: wrap; gap: 0.4rem; }
    .ptag { 
      background: #f0f9ff; color: #0369a1; padding: 0.2rem 0.5rem; 
      border-radius: 6px; font-size: 0.75rem; font-weight: 600; 
      border: 1px solid #e0f2fe; display: flex; align-items: center; gap: 4px;
    }
    .qty-badge { background: #bae6fd; padding: 0.1rem 0.3rem; border-radius: 4px; color: #075985; font-size: 0.7rem; }
    .muted { color: #94a3b8; font-size: 0.8rem; font-style: italic; }

    /* Badges & Buttons */
    .badge { display: inline-block; padding: 0.3rem 0.7rem; border-radius: 12px; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.3px; }
    .bs { background: #d1fae5; color: #065f46; border: 1px solid #a7f3d0; }
    .bd { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }

    .abts { display: flex; gap: 0.4rem; justify-content: flex-end; }
    .action-btn { 
      width: 32px; height: 32px; border-radius: 8px; border: none; cursor: pointer; 
      display: flex; align-items: center; justify-content: center; font-size: 0.9rem;
      transition: all 0.2s; background: #f1f5f9; color: #475569;
    }
    .action-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .btn-edit:hover { background: #e0f2fe; color: #0284c7; }
    .btn-delete:hover { background: #fee2e2; color: #ef4444; }
    .btn-warning { background: #fffbeb; color: #d97706; border: 1px solid #fde68a; }
    .btn-success { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }

    .btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 0.6rem 1.2rem; border-radius: 10px; border: none; cursor: pointer; font-weight: 600; font-size: 0.9rem; transition: all 0.2s; font-family: inherit; }
    .btn-primary { background: #0891b2; color: #fff; box-shadow: 0 2px 4px rgba(8,145,178,0.2); }
    .btn-primary:hover:not(:disabled) { background: #0e7490; transform: translateY(-1px); }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
    .btn-cancel { background: #f1f5f9; color: #475569; border: 1px solid #e2e8f0; }
    .btn-cancel:hover { background: #e2e8f0; }
    .btn-outline-add { background: #f0fdf4; color: #16a34a; border: 1px dashed #22c55e; padding: 0.4rem 0.8rem; font-size: 0.8rem; border-radius: 8px; }
    .btn-outline-add:hover { background: #dcfce7; }
    
    .state-msg { padding: 3rem 1rem; font-weight: 500; font-size: 0.95rem; }

    /* Modal Form */
    .overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.6); backdrop-filter: blur(2px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 1rem; }
    .modal { background: #fff; border-radius: 16px; width: 100%; max-width: 600px; max-height: 90vh; display: flex; flex-direction: column; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); }
    
    .modal-head { display: flex; justify-content: space-between; align-items: center; padding: 1.25rem 1.5rem; border-bottom: 1px solid #f1f5f9; }
    .modal-head h3 { margin: 0; font-size: 1.1rem; font-family: 'Poppins', sans-serif; color: #0f172a; }
    .close-btn { background: #f1f5f9; border: none; border-radius: 50%; width: 32px; height: 32px; cursor: pointer; font-size: 1rem; color: #64748b; display: flex; align-items: center; justify-content: center; transition: background 0.2s; }
    .close-btn:hover { background: #fee2e2; color: #ef4444; }

    .modal-body { padding: 1.5rem; overflow-y: auto; flex-grow: 1; }
    
    .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem; margin-bottom: 1.5rem; }
    .fg label { display: block; font-weight: 600; font-size: 0.85rem; color: #475569; margin-bottom: 0.4rem; }
    .req { color: #ef4444; }
    .fg input { width: 100%; padding: 0.65rem 0.85rem; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.9rem; font-family: inherit; transition: border-color 0.2s; }
    .fg input:focus { outline: none; border-color: #0891b2; box-shadow: 0 0 0 3px rgba(8,145,178,0.1); }

    /* Products Section in Modal */
    .prod-section { background: #f8fafc; border-radius: 12px; padding: 1.25rem; border: 1px solid #f1f5f9; }
    .prod-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
    .prod-head label { font-weight: 700; font-size: 0.95rem; color: #0f172a; margin: 0; }
    .empty-box { text-align: center; padding: 1rem; color: #94a3b8; font-size: 0.85rem; border: 1px dashed #cbd5e1; border-radius: 8px; background: #fff; }
    
    .prod-row { display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.75rem; }
    .prod-input-group { display: flex; flex: 1; gap: 0.5rem; background: #fff; padding: 0.4rem; border-radius: 8px; border: 1px solid #e2e8f0; }
    .prod-input-group select { flex: 1; padding: 0.4rem; border: none; font-size: 0.85rem; outline: none; font-family: inherit; background: transparent; cursor: pointer; min-width: 0; }
    .prod-input-group input { width: 80px; padding: 0.4rem; border: none; border-left: 1px solid #e2e8f0; font-size: 0.85rem; outline: none; font-family: inherit; text-align: center; }
    
    .btn-remove { 
      background: #fee2e2; color: #ef4444; border: none; border-radius: 8px; 
      width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; 
      cursor: pointer; font-size: 0.9rem; flex-shrink: 0; transition: background 0.2s;
    }
    .btn-remove:hover { background: #ef4444; color: #fff; }

    .modal-foot { display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem; padding-top: 1.25rem; border-top: 1px solid #e2e8f0; }

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
      .hide-xs { display: none; }
      .text-right { text-align: left; }
      .abts { justify-content: flex-start; }
      .filter-bar { padding: 1rem; }
    }

    /* Standard Phones (< 600px) */
    @media (max-width: 600px) {
      .ph { flex-direction: column; align-items: stretch; }
      .btn-add-main { width: 100%; justify-content: center; padding: 0.8rem; }
      
      .filter-bar { flex-direction: column; gap: 0.75rem; }
      .search-wrap { width: 100%; }
      .sel-status { width: 100%; }
      
      .modal-body { padding: 1rem; }
      .form-grid { gap: 1rem; margin-bottom: 1rem; }
      
      /* Make table cells slightly smaller for more real estate */
      th, td { padding: 0.6rem; font-size: 0.8rem; }
      .cname { font-size: 0.85rem; }
      .action-btn { width: 28px; height: 28px; font-size: 0.8rem; }
    }

    /* Fold Outer Screen (~280px - 360px) */
    @media (max-width: 380px) {
      .card { padding: 0.75rem; }
      .current-page { font-size: 1rem; }
      .ps { font-size: 0.75rem; }
      
      .prod-row { flex-direction: column; align-items: stretch; }
      .btn-remove { width: 100%; margin-top: 4px; }
      .prod-input-group { flex-direction: column; padding: 0; border: none; gap: 4px; background: transparent; }
      .prod-input-group select, .prod-input-group input { width: 100%; border: 1px solid #e2e8f0; border-radius: 8px; padding: 0.6rem; text-align: left; }
      
      .modal-foot { flex-direction: column-reverse; }
      .modal-foot .btn { width: 100%; justify-content: center; }
    }
  `]
})
export class CustomersComponent implements OnInit {
  customers: Customer[] = [];
  filtered:  Customer[] = [];
  products:  Product[]  = [];
  loading = false; saving = false; showModal = false;
  search = ''; filterStatus = 'all'; editId: number | null = null;
  toasts: { msg: string; type: string }[] = [];
  form = this.emptyForm();

  constructor(private http: HttpClient) {}

  ngOnInit() { 
    this.loadCustomers(); 
    this.loadProducts(); 
  }

  loadCustomers() {
    this.loading = true;
    this.http.get<Customer[]>(`${environment.apiUrl}/Customer`).subscribe({
      next: (d) => { 
        this.customers = d; 
        this.applyFilter(); 
        this.loading = false; 
      },
      error: () => { 
        this.loading = false; 
        this.toast('Failed to load customers. Check connection.', 'error'); 
      }
    });
  }

  loadProducts() {
    this.http.get<Product[]>(`${environment.apiUrl}/Product`).subscribe({
      next: (d) => this.products = d
    });
  }

  applyFilter() {
    let list = [...this.customers];
    
    if (this.search) {
      const q = this.search.toLowerCase();
      list = list.filter(c => 
        c.name.toLowerCase().includes(q) || 
        c.phone.includes(q) || 
        (c.email && c.email.toLowerCase().includes(q))
      );
    }
    
    if (this.filterStatus === 'active') list = list.filter(c => c.isActive);
    if (this.filterStatus === 'inactive') list = list.filter(c => !c.isActive);
    
    this.filtered = list;
  }

  openAdd() { 
    this.editId = null; 
    this.form = this.emptyForm(); 
    this.showModal = true; 
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }

  openEdit(c: Customer) {
    this.editId = c.id;
    this.form = { 
      name: c.name, 
      phone: c.phone, 
      address: c.address, 
      email: c.email,
      products: c.products.map(p => ({ productId: p.productId, quantity: p.quantity })) 
    };
    this.showModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.showModal = false;
    document.body.style.overflow = 'auto';
  }

  save() {
    if(!this.form.name || !this.form.phone || !this.form.address) return;
    
    this.saving = true;
    const url = this.editId ? `${environment.apiUrl}/Customer/${this.editId}` : `${environment.apiUrl}/Customer`;
    const req = this.editId ? this.http.put(url, this.form) : this.http.post(url, this.form);
    
    req.subscribe({
      next: () => { 
        this.closeModal(); 
        this.saving = false; 
        this.loadCustomers(); 
        this.toast(this.editId ? 'Customer Updated!' : 'Customer Added!', 'success'); 
      },
      error: () => { 
        this.saving = false; 
        this.toast('Failed to save customer data.', 'error'); 
      }
    });
  }

  toggle(c: Customer) {
    this.http.patch(`${environment.apiUrl}/Customer/${c.id}/toggle`, {}).subscribe({
      next: () => { 
        this.loadCustomers(); 
        this.toast(`Customer marked as ${c.isActive ? 'Inactive' : 'Active'}`, 'success'); 
      },
      error: () => this.toast('Failed to update status', 'error')
    });
  }

  delete(c: Customer) {
    if (!confirm(`Are you sure you want to delete "${c.name}"? This action cannot be undone.`)) return;
    
    this.http.delete(`${environment.apiUrl}/Customer/${c.id}`).subscribe({
      next: () => { 
        this.loadCustomers(); 
        this.toast('Customer deleted successfully', 'success'); 
      },
      error: () => this.toast('Failed to delete customer', 'error')
    });
  }

  addProduct() { 
    this.form.products.push({ productId: 0, quantity: 1 }); 
  }
  
  removeProduct(i: number) { 
    this.form.products.splice(i, 1); 
  }
  
  emptyForm() { 
    return { name:'', phone:'', address:'', email:'', products: [] as {productId:number;quantity:number}[] }; 
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