import { getProjects } from '../../biz/DBAccessor/projects-data'
import { getVisibleProjectFields } from '../../biz/DBAccessor/project-fields-data'
import { getTickets } from '../../biz/DBAccessor/tickets-data'
import { ProjectInterface } from '../../definitions/project-interfaces'
import { ProjectFieldInterface } from '../../definitions/project-field-interfaces'
import { TicketInterface } from '../../definitions/ticket-interfaces'
import { TicketInfoInterface } from '../../definitions/api-interfaces'
import { EditableType } from '../../definitions/types'

export default async (req: any, res: any) => {
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
        editable: 'onAdd' as editableType,
      },
      { title: '概要',
        field: 'Summary',
        width: 300,
        editable: 'never' as editableType,
      },
      { title: '状態',
        field: 'Status',
        editable: 'never' as editableType,
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
          editable: 'never' as editableType,
        })
      }
    })

    response.push({
      columns: columns,
      tickets: tickets.filter(ticket => ticket.ProjectId === project.ProjectId),
    })
  })

  res.status(200).json(
    { 
      response: response
    } 
  ) 
}