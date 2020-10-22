import React from 'react';
import { getProjects } from '../../biz/DBAccessor/projects-data'
import { getColumnsByFields } from '../../biz/get-columns-by-fields'
import AllTicketsTable from '../../components/all-tickets-table'
import { InitProjectFieldColumns } from '../../definitions/init-project-field-columns'
import { ProjectInterface } from '../../definitions/project-interfaces';

// 全プロジェクト > 過去チケット一覧
interface Props {
  projects: ProjectInterface[]
}

export const getStaticProps = async () => {
  const projects = await getProjects(false)
  const props = { projects: projects }

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