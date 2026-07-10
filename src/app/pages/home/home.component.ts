import { Component, signal } from '@angular/core';

import {
  ColumnDef,
  GenericTableCellDirective,
  GenericTableComponent,
} from '../../components/generic-table';

interface DemoUser {
  id: number;
  name: string;
  email: string;
  department: string;
  status: 'Active' | 'Inactive' | 'Pending';
  createdAt: Date;
}

@Component({
  selector: 'app-home',
  imports: [GenericTableComponent, GenericTableCellDirective],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  readonly columns: ColumnDef<DemoUser>[] = [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'email', header: 'Email', sortable: true, minWidth: '220px' },
    { key: 'department', header: 'Department', sortable: true },
    { key: 'status', header: 'Status', sortable: true, align: 'center', width: '120px' },
    {
      key: 'createdAt',
      header: 'Created',
      sortable: true,
      cell: (user) => user.createdAt.toLocaleDateString(),
      sortAccessor: (user) => user.createdAt.getTime(),
    },
  ];

  readonly showcaseColumns: ColumnDef<DemoUser>[] = [
    { key: 'name', header: 'Member', sortable: true },
    { key: 'email', header: 'Email' },
    { key: 'department', header: 'Department', sortable: true },
    { key: 'status', header: 'Status', align: 'center', width: '120px' },
  ];

  readonly rows = signal<DemoUser[]>([
    {
      id: 1,
      name: 'Alice Johnson',
      email: 'alice@example.com',
      department: 'Engineering',
      status: 'Active',
      createdAt: new Date('2024-03-15'),
    },
    {
      id: 2,
      name: 'Bob Smith',
      email: 'bob@example.com',
      department: 'Operations',
      status: 'Active',
      createdAt: new Date('2024-06-22'),
    },
    {
      id: 3,
      name: 'Carol Williams',
      email: 'carol@example.com',
      department: 'Support',
      status: 'Inactive',
      createdAt: new Date('2023-11-08'),
    },
    {
      id: 4,
      name: 'David Brown',
      email: 'david@example.com',
      department: 'Engineering',
      status: 'Active',
      createdAt: new Date('2025-01-30'),
    },
    {
      id: 5,
      name: 'Eva Martinez',
      email: 'eva@example.com',
      department: 'Finance',
      status: 'Active',
      createdAt: new Date('2024-09-12'),
    },
    {
      id: 6,
      name: 'Frank Lee',
      email: 'frank@example.com',
      department: 'Operations',
      status: 'Pending',
      createdAt: new Date('2025-02-18'),
    },
    {
      id: 7,
      name: 'Grace Kim',
      email: 'grace@example.com',
      department: 'Support',
      status: 'Active',
      createdAt: new Date('2024-07-04'),
    },
    {
      id: 8,
      name: 'Henry Davis',
      email: 'henry@example.com',
      department: 'Finance',
      status: 'Inactive',
      createdAt: new Date('2023-05-27'),
    },
    {
      id: 9,
      name: 'Ivy Chen',
      email: 'ivy@example.com',
      department: 'Engineering',
      status: 'Active',
      createdAt: new Date('2025-03-01'),
    },
    {
      id: 10,
      name: 'Jack Wilson',
      email: 'jack@example.com',
      department: 'Operations',
      status: 'Pending',
      createdAt: new Date('2024-12-19'),
    },
    {
      id: 11,
      name: 'Karen Taylor',
      email: 'karen@example.com',
      department: 'Support',
      status: 'Active',
      createdAt: new Date('2024-04-03'),
    },
    {
      id: 12,
      name: 'Leo Anderson',
      email: 'leo@example.com',
      department: 'Finance',
      status: 'Active',
      createdAt: new Date('2023-08-14'),
    },
  ]);

  readonly showcaseRows = signal<DemoUser[]>(this.rows().slice(0, 5));
  readonly emptyRows = signal<DemoUser[]>([]);

  readonly selectedRow = signal<DemoUser | null>(null);

  onRowClick(row: DemoUser): void {
    this.selectedRow.set(row);
  }

  trackById(_index: number, row: DemoUser): number {
    return row.id;
  }

  initials(row: DemoUser): string {
    return row.name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }

  statusBadgeClass(status: string): string {
    return `home__status-badge home__status-badge--${status.toLowerCase()}`;
  }
}
