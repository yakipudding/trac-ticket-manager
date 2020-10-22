import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { TicketInfoInterface } from '../definitions/api-interfaces'
import { getVisibleTickets } from '../biz/get-visible-tickets'
import TicketsTable from '../components/tickets-table'

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

export const getStaticProps = async () => {
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
          <div key={ticketInfo.tickets[0].ProjectId} className={classes.table}>
            <TicketsTable
              columns={ticketInfo.columns}
              tickets={ticketInfo.tickets}
              mode='project'
            />
          </div>
        )
      )}
    </>
  )
}