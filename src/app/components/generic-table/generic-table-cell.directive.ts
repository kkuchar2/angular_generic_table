import { Directive, inject, input, TemplateRef } from '@angular/core';

import { GenericTableCellContext } from './generic-table.types';

/**
 * Marks an `<ng-template>` as the custom renderer for a table column.
 *
 * Usage:
 * ```html
 * <app-generic-table [columns]="columns" [data]="rows()">
 *   <ng-template appGenericTableCell="status" let-row>
 *     <span class="badge">{{ row.status }}</span>
 *   </ng-template>
 * </app-generic-table>
 * ```
 */
@Directive({
  selector: 'ng-template[appGenericTableCell]',
})
export class GenericTableCellDirective<T = unknown> {
  /** The `key` of the column this template renders. */
  readonly columnKey = input.required<string>({ alias: 'appGenericTableCell' });

  readonly templateRef = inject<TemplateRef<GenericTableCellContext<T>>>(TemplateRef);

  static ngTemplateContextGuard<T>(
    _directive: GenericTableCellDirective<T>,
    _context: unknown,
  ): _context is GenericTableCellContext<T> {
    return true;
  }
}
