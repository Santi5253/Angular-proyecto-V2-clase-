import { Component, ContentChild, Input, TemplateRef, ViewChild, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

export interface TableColumn { key: string; header: string; type?: 'text'|'number'|'currency'|'date'|'badge'; }

@Component({
  selector: 'app-tabla',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, MatInputModule, MatFormFieldModule],
  templateUrl: './tabla.html',
  styleUrl: './tabla.css',
})
export class TablaComponent implements AfterViewInit, OnChanges {
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
  @Input() pageSize = 5;
  @Input() filterPlaceholder = 'Filtrar...';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ContentChild('actionsTpl') actionsTemplate?: TemplateRef<any>;
  dataSource = new MatTableDataSource<any>([]);
  get displayedColumns() { return this.columns.map(c => c.key); }
  ngAfterViewInit() { this.dataSource.data = this.data; this.dataSource.paginator = this.paginator; this.dataSource.sort = this.sort; this.dataSource.filterPredicate = (row, f) => { const t = f.trim().toLowerCase(); return this.columns.some(c => String(row[c.key] ?? '').toLowerCase().includes(t)); }; }
  ngOnChanges() { this.dataSource.data = this.data ?? []; }
  applyFilter(e: Event) { const v = (e.target as HTMLInputElement).value; this.dataSource.filter = v.trim().toLowerCase(); this.dataSource.paginator?.firstPage(); }
  format(v: any, type?: string) { if (v == null) return ''; if (type === 'currency') return '$' + v; if (type === 'date') return new Date(v).toLocaleString(); return String(v); }
}
