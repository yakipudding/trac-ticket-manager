import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Typography, Checkbox } from '@material-ui/core';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { AllTicketInfoInterface, GetAllTicketsParams } from '../definitions/api-interfaces'
import TicketsTable from './tickets-table'
import ConditionsAccordion from './conditions-accordion'
import { post } from '../biz/api'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    acordion: {
      marginBottom: 10,
    },
  }),
);

const AllTicketsTable = (props: AllTicketInfoInterface) => {
  const classes = useStyles();
  const [tickets, setTickets] = React.useState(props.tickets);
  const [columns, setColumns] = React.useState(props.columns);

  const handleSearch = async(params: GetAllTicketsParams) => {
    const api:any = await post("/api/get-all-tickets", params)
    setTickets(api)
  }

  const handleChangeColumns = (event: React.ChangeEvent<HTMLInputElement>) => {
    let newColumns = [...columns]
    const id = columns.findIndex(column => column.field === event.target.name)
    newColumns[id].hidden = !event.target.checked
    setColumns(newColumns);
  };

  return(
    <>
      {/* 条件 */}
      <div className={classes.acordion}>
        <ConditionsAccordion 
          projects={props.projects}
          handleSearch={handleSearch}
        />
      </div>
      {/* 表示項目 */}
      <Accordion className={classes.acordion}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="column-content"
          id="column-header"
        >
          <Typography>表示列</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup row>
            {columns.map(column => (
              <FormControlLabel
                control={<Checkbox checked={!column.hidden} onChange={handleChangeColumns} name={column.field as string} />}
                label={column.title}
                key={column.field}
              />)
            )}
          </FormGroup>
        </AccordionDetails>
      </Accordion>
      {/* テーブル */}
      <TicketsTable columns={columns} tickets={tickets} mode='all'/>
    </>
  )
}
export default AllTicketsTable