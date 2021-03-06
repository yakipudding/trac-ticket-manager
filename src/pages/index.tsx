import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { TicketInfoInterface } from '../definitions/api-interfaces'
import { getVisibleTickets } from '../biz/get-visible-tickets'
import TicketsTable from '../components/tickets-table'

// ダッシュボード（アクティブチケット一覧）
interface Props {
  ticketInfos: TicketInfoInterface[]
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    table: {
      marginBottom: 15,
    },
  }),
);

export const getServerSideProps = async () => {
  const visibleTickets = await getVisibleTickets()
  return {
    props: {
      ticketInfos: visibleTickets
    }
  }
}

export default (props: Props) => {
  const classes = useStyles();

  return(
    <>
      {props.ticketInfos.map(ticketInfo => 
        (
          <div key={ticketInfo.project.ProjectId} className={classes.table}>
            <TicketsTable
              columns={ticketInfo.columns}
              project={ticketInfo.project}
              tickets={ticketInfo.tickets}
              mode='project'
            />
          </div>
        )
      )}
    </>
  )
}