# Generic Table

A configurable, signal-based table built on Angular Material's `mat-table`. Drop the
`generic-table` folder into any Angular 20+ project and use it.

## Features

- Column-driven configuration (`ColumnDef<T>`)
- Optional per-column sorting
- Optional pagination, or a scrollable body with a sticky header
- Chip-based column visibility toggle
- Custom cell templates (badges, links, avatars, anything)
- Optional row click (mouse + keyboard) with hover styling
- Centered empty state
- Fully typed via generics, `OnPush` + signals, zoneless friendly
- Self-contained styling via overridable `--gt-*` CSS variables

## Requirements

- `@angular/core`, `@angular/common`
- `@angular/material` + `@angular/cdk` (provides `mat-table`, `mat-sort`, `mat-paginator`, `mat-chips`)

## Setup

1. Copy the `generic-table` folder into your project (e.g. `src/app/components/generic-table`).
2. Ensure `@angular/material` is installed.
3. Add a Material theme once, globally (e.g. in `src/styles.scss`):

   ```scss
   @use '@angular/material' as mat;

   html {
     color-scheme: light;

     @include mat.theme(
       (
         color: (
           primary: mat.$azure-palette,
         ),
         typography: Roboto,
         density: 0,
       )
     );
   }
   ```

   No animations provider is required (`mat-table`, `mat-sort`, `mat-paginator`, and
   `mat-chips` do not depend on `@angular/animations`).

## Basic usage

```ts
import { Component, signal } from '@angular/core';
import { ColumnDef, GenericTableComponent } from './components/generic-table';

interface User {
  name: string;
  email: string;
  createdAt: Date;
}

@Component({
  selector: 'app-users',
  imports: [GenericTableComponent],
  template: `
    <app-generic-table [columns]="columns" [data]="rows()" [paginated]="true" />
  `,
})
export class UsersComponent {
  readonly columns: ColumnDef<User>[] = [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'email', header: 'Email' },
    {
      key: 'createdAt',
      header: 'Created',
      sortable: true,
      cell: (u) => u.createdAt.toLocaleDateString(),
      sortAccessor: (u) => u.createdAt.getTime(),
    },
  ];

  readonly rows = signal<User[]>([
    /* ... */
  ]);
}
```

The row type `T` is inferred from the `data`/`columns` inputs, so `cell`,
`sortAccessor`, and the `rowClick` payload are all fully typed.

## Inputs

| Input             | Type                     | Default               | Description                                              |
| ----------------- | ------------------------ | --------------------- | -------------------------------------------------------- |
| `columns`         | `ColumnDef<T>[]`         | required              | Column definitions in display order.                     |
| `data`            | `readonly T[]`           | required              | Row data (sorted/paginated client-side).                 |
| `paginated`       | `boolean`                | `false`               | Show a paginator; otherwise the body scrolls.            |
| `pageSize`        | `number`                 | `10`                  | Initial page size.                                       |
| `pageSizeOptions` | `number[]`               | `[5, 10, 25, 50]`     | Page size choices.                                       |
| `showColumnToggle`| `boolean`                | `true`                | Show the column visibility chips.                        |
| `emptyMessage`    | `string`                 | `'No data available'` | Message shown when there are no rows.                    |
| `rowClickable`    | `boolean`                | `false`               | Enable row click + hover styling.                        |
| `maxHeight`       | `string \| null`         | `null`                | Cap the scroll area. Absolute lengths (`'320px'`) work on their own; relative values (`'100%'`, `'100cqh'`, `'100dvh'`) need a sized parent — see [Filling a flex parent](#filling-a-flex-parent) below. |
| `trackBy`         | `TrackByFunction<T>`     | identity tracking     | Row `trackBy`; defaults to tracking by row identity.     |

## Outputs

| Output       | Payload     | Description                                        |
| ------------ | ----------- | -------------------------------------------------- |
| `rowClick`   | `T`         | Emitted on row click when `rowClickable` is true.  |
| `sortChange` | `Sort`      | Emitted when the sort state changes.               |
| `pageChange` | `PageEvent` | Emitted when the page changes.                     |

### Filling a flex parent

Relative `maxHeight` values (`100%`, `100cqh`, `100dvh`, …) scroll inside the space
left on the page. Two things usually block this:

1. **Flex items default to `min-height: auto`** — a `flex: 1` wrapper grows with
   table content unless you set `min-height: 0`.
2. **`container-type: inline-size` has no block axis** — `cqh` / `cqb` units need
   `container-type: size` or `block-size` on the query container.

```css
.table-panel {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  container-type: size; /* or block-size; required for cqh/cqb */
}
```

```html
<div class="table-panel">
  <app-generic-table maxHeight="100%" [columns]="columns" [data]="rows()" />
  <!-- or maxHeight="100cqh" when container-type includes block size -->
</div>
```

## `ColumnDef<T>`

| Property       | Type                            | Description                                                        |
| -------------- | ------------------------------- | ----------------------------------------------------------------- |
| `key`          | `string`                        | Unique id; also the default `row[key]` accessor.                  |
| `header`       | `string`                        | Header label.                                                     |
| `sortable`     | `boolean`                       | Enable sorting for this column (default `false`).                 |
| `cell`         | `(row: T) => string \| number`  | Custom text formatter (default `row[key]`).                       |
| `sortAccessor` | `(row: T) => string \| number`  | Value used for sorting (default `cell`, then `row[key]`).         |
| `hideable`     | `boolean`                       | If `false`, always visible and not shown in the toggle (default `true`). |
| `visible`      | `boolean`                       | Initial visibility (default `true`).                             |
| `width`        | `string`                        | Fixed width, e.g. `'120px'` or `'20%'`.                          |
| `minWidth`     | `string`                        | Minimum width, e.g. `'120px'`; the column never shrinks below it. |
| `align`        | `'left' \| 'center' \| 'right'` | Text alignment (default `'left'`).                               |

## Custom cell templates

Project an `<ng-template appGenericTableCell="<columnKey>">` to render rich content
for a column. Import `GenericTableCellDirective` alongside the table.

```ts
import { GenericTableCellDirective, GenericTableComponent } from './components/generic-table';

@Component({
  imports: [GenericTableComponent, GenericTableCellDirective],
  /* ... */
})
```

```html
<app-generic-table [columns]="columns" [data]="rows()">
  <ng-template appGenericTableCell="status" [appGenericTableCellFor]="rows()" let-row>
    <span class="badge badge--{{ row.status }}">{{ row.status }}</span>
  </ng-template>
</app-generic-table>
```

The template context exposes the row as both `$implicit` (`let-row`) and `row`
(`let-row="row"`). A column can still define a `cell` formatter for sorting/plain
rendering; when a matching template exists it takes precedence for display.

### Typing `let-row`

Bind `[appGenericTableCellFor]` to the same value you pass to `[data]`. The
directive infers its row type from that binding (the same way `*ngFor` infers its
item type from `ngForOf`), so `let-row` is fully typed under `strictTemplates` —
no `$any` casts. The binding is inference-only and is never read at runtime.

> If you omit `[appGenericTableCellFor]`, `let-row` falls back to `unknown`.

## Styling

Colors, spacing, and radii are exposed as CSS variables on `.generic-table`. Override
any of them from a parent scope:

```css
app-generic-table .generic-table {
  --gt-header-accent: #3f51b5; /* header underline color */
  --gt-row-even-bg: #f0f4ff;   /* zebra striping */
}
```

| Variable            | Purpose                     |
| ------------------- | --------------------------- |
| `--gt-gap`          | Gap between toolbar/table/paginator |
| `--gt-toggle-gap`   | Gap between toggle chips     |
| `--gt-border`       | Scroll container border      |
| `--gt-radius`       | Scroll container radius      |
| `--gt-header-bg`    | Header background            |
| `--gt-header-text`  | Header text color            |
| `--gt-header-accent`| Header bottom border color   |
| `--gt-row-odd-bg`   | Odd row background           |
| `--gt-row-even-bg`  | Even row background          |
| `--gt-row-hover-bg` | Clickable row hover color    |
| `--gt-row-divider`  | Divider between rows         |
| `--gt-empty-color`  | Empty-state text color       |
| `--gt-empty-padding`| Empty-state padding          |

Each variable falls back to a default, so the component looks correct with no
external setup. It also reuses `--spacing-*` / `--color-*` design tokens when they
exist in the host project.

## Change detection

The component is `OnPush` and 100% signal-driven (`input()`, `computed()`,
`linkedSignal()`, `viewChild()`, `contentChildren()`). That is exactly the
signal-first setup: Angular only re-renders when a signal changes, which also works
in a zoneless app (`provideZonelessChangeDetection()`). No manual
`ChangeDetectorRef` calls are needed.

## Files

| File                             | Responsibility                          |
| -------------------------------- | --------------------------------------- |
| `generic-table.component.ts`     | Component logic (signals, data source)  |
| `generic-table.component.html`   | Template                                |
| `generic-table.component.scss`   | Self-contained styling                  |
| `generic-table-cell.directive.ts`| Custom cell template directive          |
| `generic-table.types.ts`         | `ColumnDef<T>`, `GenericTableCellContext<T>` |
| `index.ts`                       | Public barrel export                    |
