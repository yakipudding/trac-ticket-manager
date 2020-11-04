import React from 'react';
import { getProjectIds, getProject } from '../../../biz/DBAccessor/projects-data'
import { getProjectFields } from '../../../biz/DBAccessor/project-fields-data'
import { getAllTickets } from '../../../biz/DBAccessor/tickets-data'
import { getColumnsByFields } from '../../../biz/get-columns-by-fields'
import AllTicketsTable from '../../../components/all-tickets-table'
import { ProjectInterface } from '../../../definitions/project-interfaces';
import { ProjectFieldInterface } from '../../../definitions/project-field-interfaces'
import { TicketInterface } from '../../../definitions/ticket-interfaces';

// プロジェクト > 過去チケット一覧
interface Props {
  project: ProjectInterface,
  projectFields: ProjectFieldInterface[],
  tickets: TicketInterface[],
}

export const getServerSideProps = async ( params: { params: { id: string } } ) => {
  const projectId = params.params.id
  const projectIdNum = parseInt(params.params.id)
  const project = await getProject(projectIdNum)
  const projectFields = await getProjectFields(projectIdNum)
  const tickets: TicketInterface[] = await getAllTickets([projectId], '', '')
  
  return {
    props: {
      project: project[0],
      projectFields: projectFields,
      tickets: tickets,
    }
  }
}

export default (props: Props) => {
  let projects = []
  projects.push({ projectId: props.project.ProjectId.toString(), projectName: props.project.ProjectName })
  
  return(
    <>
      <AllTicketsTable
        projects={projects}
        columns={getColumnsByFields(props.projectFields, false)}
        tickets={props.tickets}
      />
    </>
  )
}