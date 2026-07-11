// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { HttpClient } from '@angular/common/http';
// import { environment } from '../../../environments/environment';

// interface Product {
//   id: number;
//   name: string;
//   pricePerUnit: number;
//   unit: string;
//   isActive: boolean;
// }

// @Component({
//   selector: 'app-products',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   template: `
//     <div class="toast-container">
//       <div *ngFor="let t of toasts" class="toast" [class]="'toast-'+t.type">
//         {{ t.msg }}
//       </div>
//     </div>

//     <div class="ph">
//       <div>
//         <div class="pt">🥛 Products</div>
//         <div class="ps">{{ products.length }} products available</div>
//       </div>

//       <button class="btn btn-primary" (click)="openAdd()">
//         ➕ Add Product
//       </button>
//     </div>

//     <div class="card filter-bar">
//       <input
//         type="text"
//         class="form-control"
//         placeholder="🔍 Search Product"
//         [(ngModel)]="search"
//         (input)="applyFilter()"
//       />
//     </div>

//     <div class="card">
//       <div *ngIf="loading" class="empty">
//         ⏳ Loading Products...
//       </div>

//       <div *ngIf="!loading && filtered.length===0" class="empty">
//         No products found
//       </div>

//       <div class="table-wrap" *ngIf="!loading && filtered.length">
//         <table>
//           <thead>
//             <tr>
//               <th>#</th>
//               <th>Product Name</th>
//               <th>Price</th>
//               <th>Unit</th>
//               <th>Status</th>
//               <th width="150">Actions</th>
//             </tr>
//           </thead>

//           <tbody>
//             <tr *ngFor="let p of filtered; let i=index">

//               <td>{{ i+1 }}</td>

//               <td>
//                 <strong>{{ p.name }}</strong>
//               </td>

//               <td>₹ {{ p.pricePerUnit }}</td>

//               <td>{{ p.unit }}</td>

//               <td>
//                 <span
//                   class="badge"
//                   [class.bs]="p.isActive"
//                   [class.bd]="!p.isActive">

//                   {{ p.isActive ? 'Active' : 'Inactive' }}

//                 </span>
//               </td>

//               <td>
//                 <div class="abts">

//                   <button
//                     class="btn btn-sm btn-outline"
//                     (click)="openEdit(p)">
//                     ✏️
//                   </button>

//                   <button
//                     class="btn btn-sm btn-danger"
//                     (click)="delete(p)">
//                     🗑️
//                   </button>

//                 </div>
//               </td>

//             </tr>
//           </tbody>
//         </table>
//       </div>
//     </div>

//     <div class="overlay" *ngIf="showModal" (click)="showModal=false">

//       <div class="modal" (click)="$event.stopPropagation()">

//         <div class="modal-head">
//           <h3>
//             {{ editId ? '✏️ Edit Product' : '➕ Add Product' }}
//           </h3>

//           <button class="close" (click)="showModal=false">
//             ✕
//           </button>
//         </div>

//         <form (ngSubmit)="save()">

//           <div class="fg">
//             <label>Product Name *</label>

//             <input
//               type="text"
//               [(ngModel)]="form.name"
//               name="name"
//               required
//             />
//           </div>

//           <div class="fg">
//             <label>Price Per Unit *</label>

//             <input
//               type="number"
//               [(ngModel)]="form.pricePerUnit"
//               name="pricePerUnit"
//               required
//             />
//           </div>

//           <div class="fg">
//             <label>Unit *</label>

//             <select
//               [(ngModel)]="form.unit"
//               name="unit">

//               <option [value]="1">Liter</option>
//               <option [value]="2">Kg</option>

//             </select>
//           </div>

//           <div class="fg">
//             <label>Status</label>

//             <select
//               [(ngModel)]="form.isActive"
//               name="isActive">

//               <option [ngValue]="true">Active</option>
//               <option [ngValue]="false">Inactive</option>

//             </select>
//           </div>

//           <div class="modal-foot">

//             <button
//               type="button"
//               class="btn btn-outline"
//               (click)="showModal=false">

//               Cancel

//             </button>

//             <button
//               type="submit"
//               class="btn btn-primary"
//               [disabled]="saving">

//               {{ saving ? 'Saving...' : (editId ? 'Update' : 'Save') }}

//             </button>

//           </div>

//         </form>

//       </div>

//     </div>
//   `,
//   styles: [`
//     .ph{display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem}
//     .pt{font-size:1.4rem;font-weight:700}
//     .ps{color:#64748b;font-size:.85rem}
//     .card{background:#fff;padding:1rem;border-radius:12px;box-shadow:0 1px 4px rgba(0,0,0,.08)}
//     .filter-bar{margin-bottom:1rem}
//     .form-control{width:100%;padding:.7rem;border:1px solid #ddd;border-radius:8px}
//     .table-wrap{overflow:auto}
//     table{width:100%;border-collapse:collapse}
//     th,td{padding:.75rem;text-align:left;border-bottom:1px solid #eee}
//     .badge{padding:.25rem .7rem;border-radius:20px;font-size:.75rem;font-weight:600}
//     .bs{background:#d1fae5;color:#065f46}
//     .bd{background:#fee2e2;color:#991b1b}
//     .abts{display:flex;gap:.5rem}
//     .btn{padding:.5rem 1rem;border:none;border-radius:8px;cursor:pointer;font-weight:600}
//     .btn-primary{background:#0891b2;color:white}
//     .btn-outline{border:1px solid #0891b2;background:white;color:#0891b2}
//     .btn-danger{background:#ef4444;color:white}
//     .btn-sm{padding:.3rem .7rem}
//     .empty{text-align:center;padding:2rem;color:#94a3b8}

//     .overlay{
//       position:fixed;
//       inset:0;
//       background:rgba(0,0,0,.4);
//       display:flex;
//       align-items:center;
//       justify-content:center;
//       z-index:1000
//     }

//     .modal{
//       width:500px;
//       max-width:95%;
//       background:white;
//       border-radius:12px;
//       padding:1.5rem
//     }

//     .modal-head{
//       display:flex;
//       justify-content:space-between;
//       align-items:center;
//       margin-bottom:1rem
//     }

//     .close{
//       background:none;
//       border:none;
//       cursor:pointer;
//       font-size:1.2rem
//     }

//     .fg{
//       margin-bottom:1rem
//     }

//     .fg label{
//       display:block;
//       margin-bottom:.3rem;
//       font-weight:600
//     }

//     .fg input,
//     .fg select{
//       width:100%;
//       padding:.65rem;
//       border:1px solid #ddd;
//       border-radius:8px
//     }

//     .modal-foot{
//       display:flex;
//       justify-content:flex-end;
//       gap:.75rem;
//       margin-top:1rem
//     }

//     .toast-container{
//       position:fixed;
//       top:20px;
//       right:20px;
//       z-index:2000
//     }

//     .toast{
//       color:white;
//       padding:.8rem 1rem;
//       border-radius:8px;
//       margin-bottom:.5rem
//     }

//     .toast-success{background:#10b981}
//     .toast-error{background:#ef4444}
//   `]
// })
// export class ProductsComponent implements OnInit {

//   products: Product[] = [];
//   filtered: Product[] = [];

//   loading = false;
//   saving = false;
//   showModal = false;

//   search = '';
//   editId: number | null = null;

//   toasts: { msg: string; type: string }[] = [];

//   form = {
//     name: '',
//     pricePerUnit: 0,
//     unit: 1,
//     isActive: true
//   };

//   constructor(private http: HttpClient) {}

//   ngOnInit() {
//     this.loadProducts();
//   }

//   loadProducts() {
//     this.loading = true;

//     this.http.get<Product[]>(`${environment.apiUrl}/Product`)
//       .subscribe({
//         next: data => {
//           this.products = data;
//           this.filtered = data;
//           this.loading = false;
//         },
//         error: () => {
//           this.loading = false;
//           this.toast('Failed to load products', 'error');
//         }
//       });
//   }

//   applyFilter() {
//     const s = this.search.toLowerCase();

//     this.filtered = this.products.filter(x =>
//       x.name.toLowerCase().includes(s)
//     );
//   }

//   openAdd() {
//     this.editId = null;

//     this.form = {
//       name: '',
//       pricePerUnit: 0,
//       unit: 1,
//       isActive: true
//     };

//     this.showModal = true;
//   }

//   openEdit(product: Product) {

//     this.editId = product.id;

//     this.form = {
//       name: product.name,
//       pricePerUnit: product.pricePerUnit,
//       unit: product.unit === 'Liter' ? 1 : 2,
//       isActive: product.isActive
//     };

//     this.showModal = true;
//   }

//   save() {

//     this.saving = true;

//     const url = this.editId
//       ? `${environment.apiUrl}/Product/${this.editId}`
//       : `${environment.apiUrl}/Product`;

//     const request = this.editId
//       ? this.http.put(url, this.form)
//       : this.http.post(url, this.form);

//     request.subscribe({
//       next: () => {

//         this.saving = false;
//         this.showModal = false;

//         this.loadProducts();

//         this.toast(
//           this.editId
//             ? 'Product Updated Successfully'
//             : 'Product Added Successfully',
//           'success'
//         );
//       },
//       error: () => {
//         this.saving = false;
//         this.toast('Failed To Save Product', 'error');
//       }
//     });
//   }

//   delete(product: Product) {

//     if (!confirm(`Delete ${product.name}?`))
//       return;

//     this.http.delete(`${environment.apiUrl}/Product/${product.id}`)
//       .subscribe({
//         next: () => {
//           this.loadProducts();
//           this.toast('Deleted Successfully', 'success');
//         },
//         error: () => {
//           this.toast('Delete Failed', 'error');
//         }
//       });
//   }

//   toast(msg: string, type: string) {

//     const t = { msg, type };

//     this.toasts.push(t);

//     setTimeout(() => {
//       this.toasts.splice(this.toasts.indexOf(t), 1);
//     }, 3000);
//   }
// }
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';

interface Product {
  id: number;
  name: string;
  pricePerUnit: number;
  unit: string | number;
  isActive: boolean;
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="toast-container">
      <div *ngFor="let t of toasts" class="toast" [class]="'toast-'+t.type">
        {{ t.msg }}
      </div>
    </div>

    <div class="page-container">
      <header class="ph">
        <div>
          <div class="breadcrumb">
            <a routerLink="/dashboard" class="brand-link">📊 Dashboard</a> 
            <span class="divider">/</span>
            <span class="current-page">📦 Products</span>
          </div>
          <div class="ps">{{ products.length }} products available in catalog</div>
        </div>
        <button class="btn btn-primary btn-add-main" (click)="openAdd()">
          <span>➕</span> Add Product
        </button>
      </header>

      <div class="card filter-bar">
        <div class="search-wrap">
          <span class="search-icon">🔍</span>
          <input
            type="text"
            class="form-control pl-icon"
            placeholder="Search products by name..."
            [(ngModel)]="search"
            (input)="applyFilter()"
          />
        </div>
      </div>

      <div class="card mt">
        <div *ngIf="loading" class="empty state-msg">
          ⏳ Loading Products...
        </div>

        <div *ngIf="!loading && filtered.length === 0" class="empty state-msg">
          No products found.
        </div>

        <div class="table-wrap" *ngIf="!loading && filtered.length > 0">
          <table>
            <thead>
              <tr>
                <th class="w-seq">#</th>
                <th>Product Name</th>
                <th>Price / Rate</th>
                <th>Unit Type</th>
                <th>Status</th>
                <th class="text-right w-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let p of filtered; let i=index" class="hover-row">
                <td><span class="rank">{{ i+1 }}</span></td>
                <td>
                  <strong class="pname">{{ p.name }}</strong>
                </td>
                <td>
                  <span class="price-txt">₹{{ p.pricePerUnit | number:'1.0-2' }}</span>
                </td>
                <td>
                  <span class="unit-badge">{{ p.unit }}</span>
                </td>
                <td>
                  <span class="badge" [class.bs]="p.isActive" [class.bd]="!p.isActive">
                    {{ p.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td>
                  <div class="abts">
                    <button class="action-btn btn-edit" title="Edit" (click)="openEdit(p)">✏️</button>
                    <button class="action-btn btn-delete" title="Delete" (click)="delete(p)">🗑️</button>
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
          <h3>{{ editId ? '✏️ Edit Product' : '➕ Add New Product' }}</h3>
          <button class="close-btn" (click)="closeModal()">✕</button>
        </div>

        <form (ngSubmit)="save()" class="modal-body">
          <div class="fg">
            <label>Product Name <span class="req">*</span></label>
            <input
              type="text"
              [(ngModel)]="form.name"
              name="name"
              placeholder="e.g. Full Cream Milk"
              required
            />
          </div>

          <div class="form-grid">
            <div class="fg">
              <label>Price Per Unit (₹) <span class="req">*</span></label>
              <input
                type="number"
                min="0"
                step="0.5"
                [(ngModel)]="form.pricePerUnit"
                name="pricePerUnit"
                placeholder="0.00"
                required
              />
            </div>

            <div class="fg">
              <label>Measurement Unit <span class="req">*</span></label>
              <select [(ngModel)]="form.unit" name="unit">
                <option [value]="1">Liter (L)</option>
                <option [value]="2">Kilogram (Kg)</option>
              </select>
            </div>
          </div>

          <div class="fg">
            <label>Product Status</label>
            <select [(ngModel)]="form.isActive" name="isActive">
              <option [ngValue]="true">🟢 Active (Available)</option>
              <option [ngValue]="false">🔴 Inactive (Hidden)</option>
            </select>
          </div>

          <div class="modal-foot">
            <button type="button" class="btn btn-cancel" (click)="closeModal()">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary" [disabled]="saving || !form.name || form.pricePerUnit <= 0">
              {{ saving ? '⏳ Saving...' : (editId ? '💾 Save Changes' : '✅ Add Product') }}
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

    /* Cards */
    .card { background: #fff; border-radius: 12px; padding: 1.25rem; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }

    /* Table */
    .table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; border-radius: 8px; border: 1px solid #f1f5f9; }
    table { width: 100%; border-collapse: collapse; min-width: 550px; text-align: left; }
    th { padding: 0.85rem 1rem; font-size: 0.75rem; font-weight: 700; color: #64748b; background: #f8fafc; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e2e8f0; }
    td { padding: 0.85rem 1rem; border-bottom: 1px solid #f1f5f9; font-size: 0.85rem; vertical-align: middle; }
    .hover-row:hover td { background: #f8fafc; }
    tr:last-child td { border-bottom: none; }
    
    .w-seq { width: 40px; }
    .w-actions { width: 100px; }
    .text-right { text-align: right; }
    
    .rank { display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; background: #f1f5f9; color: #475569; border-radius: 50%; font-size: 0.75rem; font-weight: 700; }
    .pname { font-weight: 700; color: #0f172a; font-size: 0.95rem; }
    .price-txt { font-weight: 600; color: #0e7490; background: #f0f9ff; padding: 0.2rem 0.5rem; border-radius: 6px; }
    .unit-badge { background: #f1f5f9; border: 1px solid #e2e8f0; padding: 0.2rem 0.6rem; border-radius: 6px; font-size: 0.75rem; font-weight: 600; color: #475569; }

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

    .btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 0.6rem 1.2rem; border-radius: 10px; border: none; cursor: pointer; font-weight: 600; font-size: 0.9rem; transition: all 0.2s; font-family: inherit; }
    .btn-primary { background: #0891b2; color: #fff; box-shadow: 0 2px 4px rgba(8,145,178,0.2); }
    .btn-primary:hover:not(:disabled) { background: #0e7490; transform: translateY(-1px); }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
    .btn-cancel { background: #f1f5f9; color: #475569; border: 1px solid #e2e8f0; }
    .btn-cancel:hover { background: #e2e8f0; }
    
    .state-msg { padding: 3rem 1rem; font-weight: 500; font-size: 0.95rem; text-align: center; color: #64748b; }

    /* Modal Form */
    .overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.6); backdrop-filter: blur(2px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 1rem; }
    .modal { background: #fff; border-radius: 16px; width: 100%; max-width: 500px; max-height: 90vh; display: flex; flex-direction: column; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); }
    
    .modal-head { display: flex; justify-content: space-between; align-items: center; padding: 1.25rem 1.5rem; border-bottom: 1px solid #f1f5f9; }
    .modal-head h3 { margin: 0; font-size: 1.1rem; font-family: 'Poppins', sans-serif; color: #0f172a; }
    .close-btn { background: #f1f5f9; border: none; border-radius: 50%; width: 32px; height: 32px; cursor: pointer; font-size: 1rem; color: #64748b; display: flex; align-items: center; justify-content: center; transition: background 0.2s; }
    .close-btn:hover { background: #fee2e2; color: #ef4444; }

    .modal-body { padding: 1.5rem; overflow-y: auto; flex-grow: 1; }
    
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem; }
    .fg { margin-bottom: 1rem; }
    .fg label { display: block; font-weight: 600; font-size: 0.85rem; color: #475569; margin-bottom: 0.4rem; }
    .req { color: #ef4444; }
    .fg input, .fg select { width: 100%; padding: 0.65rem 0.85rem; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.9rem; font-family: inherit; transition: border-color 0.2s; background: #fff; }
    .fg input:focus, .fg select:focus { outline: none; border-color: #0891b2; box-shadow: 0 0 0 3px rgba(8,145,178,0.1); }

    .modal-foot { display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1rem; padding-top: 1.25rem; border-top: 1px solid #e2e8f0; }

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
      .btn-add-main { width: 100%; justify-content: center; padding: 0.8rem; }
      
      .modal-body { padding: 1rem; }
      .form-grid { grid-template-columns: 1fr; gap: 0; } /* Stack price and unit inputs */
      
      th, td { padding: 0.6rem; font-size: 0.8rem; }
      .pname { font-size: 0.85rem; }
      .action-btn { width: 30px; height: 30px; font-size: 0.85rem; }
    }

    /* Fold Outer Screen (~280px - 360px) */
    @media (max-width: 380px) {
      .card { padding: 0.85rem; }
      .current-page { font-size: 1rem; }
      .ps { font-size: 0.75rem; }
      
      .modal-foot { flex-direction: column-reverse; }
      .modal-foot .btn { width: 100%; justify-content: center; }
      
      .fg input, .fg select { padding: 0.55rem; font-size: 0.85rem; }
    }
  `]
})
export class ProductsComponent implements OnInit {

  products: Product[] = [];
  filtered: Product[] = [];

  loading = false;
  saving = false;
  showModal = false;

  search = '';
  editId: number | null = null;

  toasts: { msg: string; type: string }[] = [];

  form = {
    name: '',
    pricePerUnit: 0,
    unit: 1,
    isActive: true
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;

    this.http.get<Product[]>(`${environment.apiUrl}/Product`)
      .subscribe({
        next: data => {
          this.products = data;
          this.filtered = data;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.toast('Failed to load products', 'error');
        }
      });
  }

  applyFilter() {
    const s = this.search.toLowerCase();

    this.filtered = this.products.filter(x =>
      x.name.toLowerCase().includes(s)
    );
  }

  openAdd() {
    this.editId = null;

    this.form = {
      name: '',
      pricePerUnit: 0,
      unit: 1,
      isActive: true
    };

    this.showModal = true;
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }

  openEdit(product: Product) {
    this.editId = product.id;

    this.form = {
      name: product.name,
      pricePerUnit: product.pricePerUnit,
      unit: product.unit === 'Liter' || product.unit === 'L' ? 1 : 2, // Safely handles incoming string
      isActive: product.isActive
    };

    this.showModal = true;
    document.body.style.overflow = 'hidden';
  }
  
  closeModal() {
    this.showModal = false;
    document.body.style.overflow = 'auto'; // Restore background scrolling
  }

  save() {
    if (!this.form.name || this.form.pricePerUnit <= 0) return;
    
    this.saving = true;

    const url = this.editId
      ? `${environment.apiUrl}/Product/${this.editId}`
      : `${environment.apiUrl}/Product`;

    const request = this.editId
      ? this.http.put(url, this.form)
      : this.http.post(url, this.form);

    request.subscribe({
      next: () => {
        this.saving = false;
        this.closeModal();
        this.loadProducts();

        this.toast(
          this.editId
            ? 'Product Updated Successfully'
            : 'Product Added Successfully',
          'success'
        );
      },
      error: () => {
        this.saving = false;
        this.toast('Failed To Save Product', 'error');
      }
    });
  }

  delete(product: Product) {
    if (!confirm(`Are you sure you want to delete ${product.name}?`))
      return;

    this.http.delete(`${environment.apiUrl}/Product/${product.id}`)
      .subscribe({
        next: () => {
          this.loadProducts();
          this.toast('Product Deleted Successfully', 'success');
        },
        error: () => {
          this.toast('Delete Failed. Check connections.', 'error');
        }
      });
  }

  toast(msg: string, type: string) {
    const t = { msg, type };
    this.toasts.push(t);

    setTimeout(() => {
      const index = this.toasts.indexOf(t);
      if (index > -1) this.toasts.splice(index, 1);
    }, 3000);
  }
}