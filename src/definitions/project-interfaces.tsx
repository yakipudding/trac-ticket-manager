import { Column } from 'material-table';
import { ValueType } from './types'

export interface ProjectInterface {
  ProjectId: number,
  ProjectName: string,
  Url: string,
  UrlConditions: string,
  UrlColumns: string,
  UrlColumnsAll: string,
  Order: string,
  Visible: string,
  TracFlag: string,
  type?: ValueType,
  [key: string]: any,
}

export interface ProjectTableInterface {
  columns: Column<ProjectInterface>[];
  data: ProjectInterface[];
}