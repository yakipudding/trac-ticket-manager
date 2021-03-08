import { TicketInterface } from './ticket-interfaces'
import { Column } from 'material-table';
import { ProjectInterface } from './project-interfaces';

export interface TicketInfoInterface { 
  columns: Column<TicketInterface>[];
  project: ProjectInterface;
  tickets: TicketInterface[];
}

export interface AllTicketInfoInterface {
  projects: { projectId: string, projectName: string }[]
  columns: Column<TicketInterface>[];
  tickets: TicketInterface[];
}

export interface TodayTicketInfoInterface {
  columns: Column<TicketInterface>[];
  tickets: TicketInterface[];
}

export interface GetAllTicketsParams {
  ProjectIds: string[];
  CompleteDateFrom: string;
  CompleteDateTo: string;
}