import React from 'react';
import Router from 'next/router'
import MaterialTable from 'material-table';
import { UserDictionaryInterface } from '../../definitions/setting-interfaces'
import { ValueType, EditableType } from '../../definitions/types'
import { get, post } from '../../biz/api'
import { getUserDictionary } from '../../biz/DBAccessor/user-dictionary-data'

interface Props {
  userDictionary: UserDictionaryInterface[]
}

const columns = [
  { title: '優先度',
    field: 'Priority',
    type: 'numeric' as ValueType,
  },
  { title: 'ユーザ名（ローマ字）',
    field: 'User',
  },
  { title: 'ユーザ名（日本語）',
    field: 'UserName',
  },
]

export const getStaticProps = async () => {
  const userDictionary = await getUserDictionary()
  const props = { userDictionary: userDictionary }

  return {
    props
  }
}

export default ( props: Props) => {
  const [state, setState] = React.useState<UserDictionaryInterface[]>(
    props.userDictionary,
  );

  const onRowAdd = async (newData : UserDictionaryInterface) => {
    // DB更新
    await post("/api/insert-user-dictionary", newData)
    // idを取得するためリロード
    Router.reload()
  }
  
  const onRowUpdate = async (newData : UserDictionaryInterface, oldData : UserDictionaryInterface | undefined) => {
    if (oldData) {
      // DB更新
      post("/api/update-user-dictionary", newData)
      setState(prevState => {
        const data = [...prevState];
        data[data.indexOf(oldData)] = newData;
        return data
      });
    }
  }
  
  const onRowDelete = async (oldData: UserDictionaryInterface | undefined) => {
    if (oldData) {
      // DB削除
      post("/api/delete-user-dictionary", oldData.UserId)
      setState(prevState => {
        const data = [...prevState];
        data.splice(data.indexOf(oldData), 1);
        return data;
      });
    }
  }

  return (
    <MaterialTable
      title="ユーザー辞書一覧"
      columns={columns}
      data={state}
      options={{
        paging: false,
      }}
      editable={{
        onRowAdd: onRowAdd,
        onRowUpdate: onRowUpdate,
        onRowDelete: onRowDelete,
      }}
    />
  );
}