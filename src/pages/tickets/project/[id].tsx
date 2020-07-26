import React from 'react';
import { get, post } from '../../../biz/api'
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
  const res = await get("/api/get-projectids")

  return {
    paths: res.response.map((projectId: { id: string }) => { return { params: projectId } }),
    fallback: false,
  }
}

export const getStaticProps = async ( params: { params: { id: string } } ) => {
  const projectFieldsApi = await get("/api/get-project-fields", params)

  const apiparams = {
    ProjectIds: [params.params.id],
    CompleteDateFrom: '',
    CompleteDateTo: '',
  }
  const ticketsApi = await post("/api/get-all-tickets", apiparams)

  return {
    props: {
      project: projectFieldsApi.response.project,
      projectFields: projectFieldsApi.response.projectFields,
      tickets: ticketsApi.response.tickets,
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