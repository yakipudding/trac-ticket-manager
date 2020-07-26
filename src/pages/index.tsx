import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { TicketInfoInterface } from '../definitions/api-interfaces'
import { get } from '../biz/api'
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
  const api = await get("/api/get-visible-tickets")
  const response = api.response
  return {
    props: {
      ticketInfos: response
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