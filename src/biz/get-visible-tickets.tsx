import { getProjects } from './DBAccessor/projects-data'
import { getVisibleProjectFields } from './DBAccessor/project-fields-data'
import { getTickets } from './DBAccessor/tickets-data'
import { ProjectInterface } from '../definitions/project-interfaces'
import { ProjectFieldInterface } from '../definitions/project-field-interfaces'
import { TicketInterface } from '../definitions/ticket-interfaces'
import { TicketInfoInterface } from '../definitions/api-interfaces'
import { EditableType } from '../definitions/types'

export const getVisibleTickets = async () => {
  const projects: ProjectInterface[] = await getProjects(true)
  const projectFields: ProjectFieldInterface[] = await getVisibleProjectFields()
  const tickets: TicketInterface[] = await getTickets(true)
  type editableType = EditableType<TicketInterface>
  
  let response: TicketInfoInterface[] = []
  projects.forEach((project) => {
    const fields = projectFields.filter(projectField => projectField.ProjectId === project.ProjectId)
    let columns = [
      { title: 'カテゴリ',
        field: 'Category',
        editable: 'always' as editableType,
      },
      { title: 'ID',
        field: 'TracId',
        editable: project.TracFlag ? 'onAdd' as editableType : 'never' as editableType,
        hidden: !project.TracFlag,
      },
      { title: '概要',
        field: 'Summary',
        width: 300,
        editable: project.TracFlag ? 'never' as editableType : 'always' as editableType,
      },
      { title: '状態',
        field: 'Status',
        editable: project.TracFlag ? 'never' as editableType : 'always' as editableType,
        lookup: { 'new': '起票', 'assigned': '未着手', 'accepted': '仕掛', 'closed': '完了', 'reopened': '再開' },
      },
      { title: 'メモ',
        field: 'Memo',
        editable: 'always' as editableType,
      },
    ]
    fields.forEach(field => {
      if(!(field.Field === 'TracId' || field.Field === 'Summary' || field.Field === 'Status')){
        columns.push({
          title: field.FieldName,
          field: field.Field,
          editable: project.TracFlag ? 'never' as editableType : 'always' as editableType,
        })
      }
    })

    response.push({
      columns: columns,
      project: project,
      tickets: tickets.filter(ticket => ticket.ProjectId === project.ProjectId),
    })
  })

  return response
}