import React from 'react';
import { getTodayTickets } from '../../biz/DBAccessor/tickets-data'
import { getColumnsByFields } from '../../biz/get-columns-by-fields'
import TodayTicketsTable from '../../components/today-tickets-table'
import { InitProjectFieldColumns } from '../../definitions/init-project-field-columns'
import { TicketInterface } from '../../definitions/ticket-interfaces';

// 全プロジェクト > 今日のチケット一覧
interface Props {
  tickets: TicketInterface[],
}

export const getServerSideProps = async () => {
  const tickets: TicketInterface[] = await getTodayTickets()
  
  return {
    props: {
      tickets: tickets,
    }
  }
}

export default (props: Props) => {
  return(
    <>
      <TodayTicketsTable
        columns={getColumnsByFields(InitProjectFieldColumns(0), true)}
        tickets={props.tickets}
      />
    </>
  )
}