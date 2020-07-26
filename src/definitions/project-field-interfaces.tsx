import { Column } from 'material-table';

export interface ProjectFieldInterface {
  ProjectFieldId: number,
  Field: string,
  TracField: string,
  FieldName: string,
  Visible: boolean,
  Order: number,
  ProjectId: number,
  [key: string]: any,
}

export interface ProjectFieldTableInterface {
  columns: Column<ProjectFieldInterface>[];
  data: ProjectFieldInterface[];
}