import { TicketInterface } from './ticket-interfaces'
import { Column } from 'material-table';

export interface TicketInfoInterface { 
  columns: Column<TicketInterface>[];
  tickets: TicketInterface[];
}

export interface AllTicketInfoInterface {
  projects: { projectId: string, projectName: string }[]
  columns: Column<TicketInterface>[];
  tickets: TicketInterface[];
}