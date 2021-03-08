import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Typography, Checkbox } from '@material-ui/core';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { TodayTicketInfoInterface } from '../definitions/api-interfaces'
import TicketsTable from './tickets-table'

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

const TodayTicketsTable = (props: TodayTicketInfoInterface) => {
  const classes = useStyles();
  const [columns, setColumns] = React.useState(props.columns);

  const handleChangeColumns = (event: React.ChangeEvent<HTMLInputElement>) => {
    let newColumns = [...columns]
    const id = columns.findIndex(column => column.field === event.target.name)
    newColumns[id].hidden = !event.target.checked
    setColumns(newColumns);
  };

  return(
    <>
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
      <TicketsTable columns={columns} tickets={props.tickets} mode='all'/>
    </>
  )
}
export default TodayTicketsTable