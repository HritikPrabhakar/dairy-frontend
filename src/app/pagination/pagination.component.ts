// src/app/pagination/pagination.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="pagination" *ngIf="totalPages > 1">
      <button class="page-btn" [disabled]="currentPage === 1"
              (click)="changePage(currentPage - 1)">◀</button>

      <ng-container *ngFor="let p of pages">
        <button class="page-btn" [class.active]="p === currentPage"
                (click)="changePage(p)">{{ p }}</button>
      </ng-container>

      <button class="page-btn" [disabled]="currentPage === totalPages"
              (click)="changePage(currentPage + 1)">▶</button>

      <span class="page-info">
        {{ currentPage }} of {{ totalPages }} ({{ totalCount }} total)
      </span>
    </div>
  `,
  styles: [`
    .pagination { display:flex; align-items:center; gap:.4rem; margin-top:1rem; flex-wrap:wrap; }
    .page-btn { width:34px; height:34px; border:1.5px solid #e2e8f0; background:#fff; border-radius:8px; cursor:pointer; font-weight:700; font-size:.85rem; transition:all .2s; }
    .page-btn:hover:not(:disabled) { border-color:#0891b2; color:#0891b2; }
    .page-btn.active { background:#0891b2; color:#fff; border-color:#0891b2; }
    .page-btn:disabled { opacity:.4; cursor:not-allowed; }
    .page-info { font-size:.8rem; color:#64748b; margin-left:.5rem; }
  `]
})
export class PaginationComponent { // <--- The "export" keyword here is strictly required!
  @Input() currentPage  = 1;
  @Input() totalPages   = 1;
  @Input() totalCount   = 0;
  @Output() pageChange  = new EventEmitter<number>();

  get pages(): number[] {
    const pages: number[] = [];
    const start = Math.max(1, this.currentPage - 2);
    const end   = Math.min(this.totalPages, this.currentPage + 2);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }

  changePage(p: number) {
    if (p >= 1 && p <= this.totalPages) this.pageChange.emit(p);
  }
}