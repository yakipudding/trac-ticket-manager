import React from 'react';
import { get, post } from '../../../biz/api'
import { getProjectIds, getProject } from '../../../biz/DBAccessor/projects-data'
import { getProjectFields } from '../../../biz/DBAccessor/project-fields-data'
import { getAllTickets } from '../../../biz/DBAccessor/tickets-data'
import { getColumnsByFields } from '../../../biz/get-columns-by-fields'
import AllTicketsTable from '../../../components/all-tickets-table'
import { ProjectInterface } from '../../../definitions/project-interfaces';
import { ProjectFieldInterface } from '../../../definitions/project-field-interfaces'
import { TicketInterface } from '../../../definitions/ticket-interfaces';

// 過去チケット一覧（プロジェクト別）
interface Props {
  project: ProjectInterface,
  projectFields: ProjectFieldInterface[],
  tickets: TicketInterface[],
}

export const getStaticPaths = async() => {
  const projectIds = await getProjectIds()

  return {
    paths: projectIds.map((projectId: { id: string }) => { return { params: projectId } }),
    fallback: false,
  }
}

export const getStaticProps = async ( params: { params: { id: string } } ) => {
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