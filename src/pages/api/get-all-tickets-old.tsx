import { getProjects } from '../../biz/DBAccessor/projects-data'
import { getTickets } from '../../biz/DBAccessor/tickets-data'
import { ProjectInterface } from '../../definitions/project-interfaces'
import { TicketInterface } from '../../definitions/ticket-interfaces'
import { InitProjectFieldColumns } from '../../definitions/init-project-field-columns'
import { EditableType } from '../../definitions/types'

export default async (req: any, res: any) => {
  const projects: ProjectInterface[] = await getProjects(false)
  const tickets: TicketInterface[] = await getTickets(false)
  type editableType = EditableType<TicketInterface>
  
  const fields = InitProjectFieldColumns(0)
  let columns = [
    { title: 'プロジェクト',
      field: 'ProjectName',
      editable: 'never' as editableType,
      hidden: false,
      type: 'string',
      searchable: false,
    },
    { title: 'カテゴリ',
      field: 'Category',
      editable: 'always' as editableType,
      hidden: false,
      type: 'string',
      searchable: true,
    },
    { title: 'ID',
      field: 'TracId',
      editable: 'onAdd' as editableType,
      hidden: false,
      searchable: false,
    },
    { title: '概要',
      field: 'Summary',
      width: 300,
      editable: 'never' as editableType,
      hidden: false,
      searchable: true,
    },
    { title: '状態',
      field: 'Status',
      editable: 'never' as editableType,
      hidden: true,
      searchable: false,
    },
    { title: 'メモ',
      field: 'Memo',
      editable: 'always' as editableType,
      hidden: false,
      searchable: true,
    },
  ]
  fields.forEach(field => {
    if(!(field.Field === 'TracId' || field.Field === 'Summary' || field.Field === 'Status')){
      columns.push({
        title: field.FieldName,
        field: field.Field,
        editable: 'never' as editableType,
        hidden: !field.Visible,
        type: (field.Field === 'CreateTime' || field.Field === 'ChangeTime' || field.Field === 'DueAssign' || field.Field === 'DueClose') 
              ? 'date' : undefined,
        searchable: false,
      })
    }
  })
  columns.push(
    { title: '完了日',
      field: 'CompleteDate',
      editable: 'never' as editableType,
      hidden: false,
      type: 'date',
      searchable: false,
    })
  columns.push(
    { title: '表示',
      field: 'Visible',
      editable: 'always' as editableType,
      hidden: false,
      type: 'boolean',
      searchable: false,
    })

  const resProjects = 
    projects.map(project => { return {projectId: project.ProjectId, projectName: project.ProjectName} })

  res.status(200).json(
    { 
      response: {
        projects: resProjects,
        columns: columns,
        tickets: tickets,
      }
    } 
  ) 
}