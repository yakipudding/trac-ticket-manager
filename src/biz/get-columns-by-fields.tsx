import { Column } from 'material-table';
import { ProjectFieldInterface } from '../definitions/project-field-interfaces'
import { TicketInterface } from '../definitions/ticket-interfaces'
import { EditableType } from '../definitions/types'

export const getColumnsByFields = (fields: ProjectFieldInterface[], projectColumnVisible: boolean) => {
  type editableType = EditableType<TicketInterface>
  // テーブル列定義
  let columns: Column<TicketInterface>[] = [
    { title: 'プロジェクト',
      field: 'ProjectName',
      editable: 'never' as editableType,
      hidden: !projectColumnVisible,
      type: 'string',
      searchable: false,
      filtering: false,
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
      filtering: false,
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
        hidden: true,
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
      filtering: false,
    })
  columns.push(
    { title: '表示',
      field: 'Visible',
      editable: 'always' as editableType,
      hidden: false,
      type: 'boolean',
      searchable: false,
    })

  return columns
}