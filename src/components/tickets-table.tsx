import React from 'react';
import Router from 'next/router'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { Column } from 'material-table';
import MaterialTable from 'material-table';
import HistoryIcon from '@material-ui/icons/History';
import Link from '@material-ui/core/Link';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import { TicketInterface } from '../definitions/ticket-interfaces'
import { post } from '../biz/api'
import MultiSetCategoryDialog from './multiset-category-dialog'

interface TicketsTableProps {
  columns: Column<TicketInterface>[];
  tickets: TicketInterface[];
  mode: 'all' | 'project',
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      alignItems: 'center',
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      paddingTop: 4,
    },
    margin: {
      margin: theme.spacing(1),
    },
  }),
);

const ColumnsSetting = (propColumns: Column<TicketInterface>[]) => {
  let columns = propColumns
  // チケットID列
  const idColumnIndex = propColumns.findIndex(column => column.field === 'TracId')
  let idColumn = { 
    ...columns[idColumnIndex], 
    render: (rowData: TicketInterface) => {
      return <Link href={`${rowData.Url}ticket/${rowData.TracId}`} target="_blank">{rowData.TracId}</Link>
    },
  }
  columns[idColumnIndex] = idColumn
  // 概要列
  const summaryColumnIndex = propColumns.findIndex(column => column.field === 'Summary')
  let summaryColumn = { 
    ...columns[summaryColumnIndex], 
    render: (rowData: TicketInterface) => {
      return rowData?.Summary && rowData.Summary.length > 40
       ? <Tooltip title={rowData.Summary}><span>{`${rowData.Summary.substr(0,39)}…`}</span></Tooltip>
       : <span>{rowData?.Summary}</span>
    },
  }
  columns[summaryColumnIndex] = summaryColumn
  // 担当者列
  const ownerColumnIndex = propColumns.findIndex(column => column.field === 'Owner')
  if(ownerColumnIndex !== -1){
    let ownerColumn = { 
      ...columns[ownerColumnIndex], 
      render: (rowData: TicketInterface) => {
        return rowData?.Owner && rowData.Owner.length > 5
         ? <Tooltip title={rowData.Owner}><span>{`${rowData.Owner.substr(0,5)}…`}</span></Tooltip>
         : <span>{rowData?.Owner}</span>
      },
    }
    columns[ownerColumnIndex] = ownerColumn
  }

  return columns
}


const TicketsTable = (props: TicketsTableProps) => {
  const classes = useStyles();
  const tableRef = React.createRef<any>()
  const [state, setState] = React.useState<TicketInterface[]>(
    props.tickets
  );
  const [open, setOpen] = React.useState(false);
  const [multiSelectTickets, setMultiSelectTickets] = React.useState<TicketInterface[] | null>(null);
  const [multiCategory, setMultiCategory] = React.useState<string>('');
  
  React.useEffect(() => {
    setState(props.tickets)
  }, [props.tickets])

  let columns = ColumnsSetting(props.columns)

  const title = props.mode === 'all' ? 
    "チケット一覧"
    :
    (
      <div className={classes.container}>
        <span className={classes.title}>{props.tickets[0].ProjectName}</span>
        <Tooltip title="過去チケット">
          <IconButton aria-label="old" className={classes.margin} href={`/tickets/project/${props.tickets[0].ProjectId}`}>
            <HistoryIcon />
          </IconButton>
        </Tooltip>
      </div>
    )

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeCategory = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMultiCategory(event.target.value)
  }

  const onRowAdd= async (newData : TicketInterface) => {
    newData = { ...newData, ProjectId: props.tickets[0].ProjectId}
    // DB更新
    await post("/api/insert-ticket", newData)
    await post("/api/trac-get-ticket", newData)
    // ticket-idを取得するためリロード
    Router.reload()
  }

  const onRowUpdate = async (newData: TicketInterface, oldData: TicketInterface | undefined) => {
    if (oldData) {
      // DB更新
      post("/api/update-ticket", newData)
      setState(prevState => {
        const data = [...prevState];
        data[data.indexOf(oldData)] = newData;
        return data;
      });
    }
  }
  
  const onRowDelete = async (oldData : TicketInterface | undefined) => {
    if (oldData) {
      // DB更新
      const newData = { ...oldData, Visible: false, CompleteDate: Date.now(), }
      if(props.mode === 'all'){
        post("/api/delete-ticket", newData)
      } 
      else{
        post("/api/update-ticket-unvisible", newData)
      }
      setState(prevState => {
        const data = [...prevState];
        data.splice(data.indexOf(oldData), 1);
        return data;
      });
    }
  }
  
  const onMultiEditCategory = async (event:any, data: TicketInterface | TicketInterface[]) => {
    if (data) {
      setMultiSelectTickets(data as TicketInterface[])
      setOpen(true)
    }
  }

  const onMultiSetCategory = async () => {
    if (multiSelectTickets) {
      // DB更新
      const params = {
        ticketIds: multiSelectTickets.map(ticket => ticket.TicketId.toString()),
        category: multiCategory
      }
      post("/api/update-tickets-category", params)
      setState(prevState => {
        const data = [...prevState];
        multiSelectTickets.forEach(ticket => {
          data[data.indexOf(ticket)] = { ...ticket, Category: multiCategory };
        })
        return data;
      });
      setOpen(false)
      setMultiCategory('')
      tableRef.current.onAllSelected(false)
    }
  }
  
  const onMultiDelete = async (event:any, data: TicketInterface | TicketInterface[]) => {
    const deleteTickets = data as TicketInterface[]
    // DB更新
    const ticketIds = deleteTickets.map(ticket => ticket.TicketId.toString())
    post("/api/update-tickets-unvisible", ticketIds)
    setState(prevState => {
      const ticketsState = [...prevState];
      deleteTickets.forEach(ticket => {
        ticketsState.splice(ticketsState.indexOf(ticket), 1);
      })
      return ticketsState;
    });
    tableRef.current.onAllSelected(false)
  }

  return(
    <>
      <MaterialTable
        tableRef={tableRef}
        title={title}
        columns={columns}
        data={state}
        options={props.mode === 'all' ? 
          {
            pageSize: 10,
            selection: true,
            padding: 'dense',
            search: false,
            filtering: true,
            draggable: false,
            toolbar: false,
          }
          :
          {
            paging: false,
            selection: true,
            padding: 'dense',
            sorting: false,
            search: false,
            draggable: false,
          }}
        editable={{
          onRowAdd: props.mode === 'all' ? undefined : onRowAdd,
          onRowUpdate: onRowUpdate,
          onRowDelete: onRowDelete,
        }}
        actions={
          props.mode === 'all' ?
          [
            {
              tooltip: '一括カテゴリセット',
              icon: 'edit',
              onClick: onMultiEditCategory
            },
          ]
          :
          [
            {
              tooltip: '一括カテゴリセット',
              icon: 'edit',
              onClick: onMultiEditCategory
            },
            {
              tooltip: '一括アーカイブ',
              icon: 'delete',
              onClick: onMultiDelete
            },
          ]
        }
      />
      <MultiSetCategoryDialog
        open={open}
        multiCategory={multiCategory}
        onClose={handleClose}
        onChange={handleChangeCategory}
        onOkClick={onMultiSetCategory}
        onCancelClick={handleClose}
      />
    </>
  )
}
export default TicketsTable