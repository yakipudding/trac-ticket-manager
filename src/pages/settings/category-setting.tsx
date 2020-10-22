import React from 'react';
import Router from 'next/router'
import MaterialTable from 'material-table';
import { CategorySettingInterface } from '../../definitions/setting-interfaces'
import { ValueType } from '../../definitions/types'
import { post } from '../../biz/api'
import { getCategorySetting } from '../../biz/DBAccessor/category-setting-data'

interface Props {
  categorySetting: CategorySettingInterface[]
}

const columns = [
  { title: '優先度',
    field: 'Priority',
    type: 'numeric' as ValueType,
  },
  { title: '単語',
    field: 'Word',
  },
  { title: 'カテゴリ',
    field: 'Category',
  },
]

export const getStaticProps = async () => {
  const categorySetting = await getCategorySetting()
  const props = { categorySetting: categorySetting }

  return {
    props
  }
}

export default ( props: Props) => {
  const [state, setState] = React.useState<CategorySettingInterface[]>(
    props.categorySetting,
  );

  const onRowAdd = async (newData : CategorySettingInterface) => {
    // DB更新
    await post("/api/insert-category-setting", newData)
    // idを取得するためリロード
    Router.reload()
  }
  
  const onRowUpdate = async (newData : CategorySettingInterface, oldData : CategorySettingInterface | undefined) => {
    if (oldData) {
      // DB更新
      post("/api/update-category-setting", newData)
      setState(prevState => {
        const data = [...prevState];
        data[data.indexOf(oldData)] = newData;
        return data
      });
    }
  }
  
  const onRowDelete = async (oldData: CategorySettingInterface | undefined) => {
    if (oldData) {
      // DB削除
      post("/api/delete-category-setting", oldData.UserId)
      setState(prevState => {
        const data = [...prevState];
        data.splice(data.indexOf(oldData), 1);
        return data;
      });
    }
  }

  return (
    <MaterialTable
      title="カテゴリ自動付与設定"
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