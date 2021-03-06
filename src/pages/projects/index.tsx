import React from 'react';
import Router from 'next/router'
import MaterialTable from 'material-table';
import { getProjects } from '../../biz/DBAccessor/projects-data'
import { ProjectInterface, ProjectTableInterface } from '../../definitions/project-interfaces'
import { ValueType, EditableType } from '../../definitions/types'
import { post } from '../../biz/api'

// プロジェクト一覧
interface Props {
  projects: ProjectInterface[]
}

const columns = [
  { title: '表示順',
    field: 'Order',
    type: 'numeric' as ValueType,
  },
  { title: 'プロジェクト名',
    field: 'ProjectName',
  },
  { title: '表示',
    field: 'Visible',
    type: 'boolean' as ValueType,
    initialEditValue: true,
  },
  { title: 'URL',
    field: 'Url',
    editable: 'never' as EditableType<ProjectInterface>,
  },
  { title: 'Trac管理',
    field: 'TracFlag',
    type: 'boolean' as ValueType,
    initialEditValue: true,
  },
]

export const getServerSideProps = async () => {
  const projects = await getProjects(true)
  const props = { projects: projects }

  return {
    props
  }
}

export default ( props: Props) => {
  const [state, setState] = React.useState<ProjectTableInterface>({
    columns: columns,
    data: props.projects,
  });

  const onRowAdd = async (newData : ProjectInterface) => {
    // DB更新
    await post("/api/insert-project", newData)
    // project-idを取得するためリロード
    Router.reload()
  }
  
  const onRowUpdate = async (newData : ProjectInterface, oldData : ProjectInterface | undefined) => {
    if (oldData) {
      // DB更新
      post("/api/update-project", newData)
      setState(prevState => {
        const data = [...prevState.data];
        data[data.indexOf(oldData)] = newData;
        return { ...prevState, data };
      });
    }
  }
  
  const onRowDelete = async (oldData: ProjectInterface | undefined) => {
    if (oldData) {
      // DB削除
      post("/api/delete-project", oldData.ProjectId)
      setState(prevState => {
        const data = [...prevState.data];
        data.splice(data.indexOf(oldData), 1);
        return { ...prevState, data };
      });
    }
  }

  return (
    <MaterialTable
      title="プロジェクト一覧"
      columns={state.columns}
      data={state.data}
      options={{
        paging: false,
        rowStyle: rowData => ({
          backgroundColor: rowData.Visible && !rowData.Url && rowData.TracFlag ? '#fce4ec' : '#FFF'
        }),
      }}
      editable={{
        onRowAdd: onRowAdd,
        onRowUpdate: onRowUpdate,
        onRowDelete: onRowDelete,
      }}
      actions={[
        {
          tooltip: '項目設定',
          icon: 'view_column',
          onClick: (evt, data: ProjectInterface) => Router.push(`/projects/columns/${data.ProjectId}`)
        },
      ]}
    />
  );
}