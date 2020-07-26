import React from 'react';
import { get } from '../../biz/api'
import { getColumnsByFields } from '../../biz/get-columns-by-fields'
import AllTicketsTable from '../../components/all-tickets-table'
import { InitProjectFieldColumns } from '../../definitions/init-project-field-columns'
import { ProjectInterface } from '../../definitions/project-interfaces';

// 過去チケット一覧（全プロジェクト）
interface Props {
  projects: ProjectInterface[]
}

export const getStaticProps = async () => {
  const api = await get("/api/get-projects")
  const props = api.response
  return {
    props
  }
}

export default (props: Props) => {
  return(
    <>
      <AllTicketsTable
        projects={props.projects.map(project => { return { projectId: project.ProjectId.toString(), projectName: project.ProjectName } } ) }
        columns={getColumnsByFields(InitProjectFieldColumns(0), true)}
        tickets={[]}
      />
    </>
  )
}