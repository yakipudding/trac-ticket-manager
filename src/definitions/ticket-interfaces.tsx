import { EditableType } from './types'

export interface TicketInterface {
  TicketId: number,
  TracId: number,
  Category: string,
  Status: string,
  Memo: string,
  Visible: boolean,
  ProjectId: number,
  Summary: string,
  Owner: string,
  CompleteDate: Date | null,
  Type: string,
  Priority: string,
  Milestone: string,
  Component: string,
  Version: string,
  CreateTime: Date,
  ChangeTime: Date,
  DueAssign: Date | null,
  DueClose: Date | null,
  Complete: number,
  Reporter: string,
  FreeField1: string,
  FreeField2: string,
  FreeField3: string,
  FreeField4: string,
  FreeField5: string,
  LastOwnerDate: Date | null,
  Url?: string,
  editable?: EditableType<TicketInterface>,
  hidden?: boolean,
  [key: string]: any,
}