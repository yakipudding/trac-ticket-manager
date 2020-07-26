import { Column } from 'material-table';
export type EditableType<RowInterface extends object> = ('always' | 'onUpdate' | 'onAdd' | 'never' | ((columnDef: Column<RowInterface>, rowData: RowInterface) => boolean));
export type ValueType = ('string' | 'boolean' | 'numeric' | 'date' | 'datetime' | 'time' | 'currency');