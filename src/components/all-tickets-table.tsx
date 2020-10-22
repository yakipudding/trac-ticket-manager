import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Button, Grid, Tooltip, TextField, Typography, FormControl, InputLabel, Select, MenuItem, Checkbox, Input, ListItemText } from '@material-ui/core';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { AllTicketInfoInterface } from '../definitions/api-interfaces'
import TicketsTable from './tickets-table'
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
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };
  const [tickets, setTickets] = React.useState(props.tickets);
  const [conditions, setConditions] = React.useState({ 
      Projects: props.projects.length === 1 ? [props.projects[0].projectName] : [],
      CompleteDateFrom: '',
      CompleteDateTo: '', 
  })
  const [showError, setShowError] = React.useState(false)
  const [columns, setColumns] = React.useState(props.columns);

  const handleChangeProjects = (event: React.ChangeEvent<{ value: unknown }>) => {
    const selectProjects = event.target.value as string[]
    setShowError(selectProjects.length === 0)
    setConditions({ 
      ...conditions,
      Projects: selectProjects
    })
  };

  const handleChangeTextField = (prop: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setConditions({ 
      ...conditions,
      [prop]: event.target.value 
    })
  }

  const handleSearch = async() => {
    if(conditions.Projects.length === 0){
      setShowError(true)
    }
    else{
      setShowError(false)
      const params = {
        ProjectIds: conditions.Projects.map(projectName => props.projects.find(project => project.projectName === projectName).projectId),
        CompleteDateFrom:conditions.CompleteDateFrom,
        CompleteDateTo:conditions.CompleteDateTo,
      }
      const api:any = await post("/api/get-all-tickets", params)
      setTickets(api)
    }
  }

  const handleChangeColumns = (event: React.ChangeEvent<HTMLInputElement>) => {
    let newColumns = [...columns]
    const id = columns.findIndex(column => column.field === event.target.name)
    newColumns[id].hidden = !event.target.checked
    setColumns(newColumns);
  };

  return(
    <>
      {/* プロジェクト */}
      <Accordion className={classes.acordion} defaultExpanded={props.projects.length !== 1}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="project-content"
          id="project-header"
        >
          <Typography>条件</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Tooltip title="プロジェクトは選択必須です" open={showError} arrow>
                <FormControl fullWidth>
                  <InputLabel id="projects-label">プロジェクト</InputLabel>
                  <Select
                    labelId="projects-label"
                    id="projects-checkbox"
                    multiple
                    value={conditions.Projects}
                    onChange={handleChangeProjects}
                    input={<Input />}
                    renderValue={(selected: string[]) => selected.join(', ')}
                    MenuProps={MenuProps}
                    error={conditions.Projects.length === 0}
                  >
                    {props.projects.map((project) => (
                      <MenuItem key={project.projectName} value={project.projectName}>
                        <Checkbox checked={conditions.Projects.indexOf(project.projectName) > -1} />
                        <ListItemText primary={project.projectName} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Tooltip>
            </Grid>
            <Grid item xs={12}>
              <TextField
                key="complete-date-from"
                id="complete-date-from"
                label="完了日（開始）"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={handleChangeTextField('CompleteDateFrom')}
                value={conditions.CompleteDateFrom}
              />
              <span>～</span>
              <TextField
                key="complete-date-to"
                id="complete-date-to"
                label="完了日（終了）"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={handleChangeTextField('CompleteDateTo')} 
                value={conditions.CompleteDateTo}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" onClick={handleSearch}>
                検索
              </Button>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
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