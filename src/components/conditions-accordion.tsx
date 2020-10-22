import React from 'react';
import { Button, Grid, Tooltip, TextField, Typography, FormControl, InputLabel, Select, MenuItem, Checkbox, Input, ListItemText } from '@material-ui/core';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

// 条件アコーディオン
interface Props {
  projects: { projectId: string, projectName: string }[],
  handleSearch: any,
}

const ConditionsAccordion = (props: Props) => {
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
  const [conditions, setConditions] = React.useState({
    Projects: props.projects.length === 1 ? [props.projects[0].projectName] : [],
    CompleteDateFrom: '',
    CompleteDateTo: '',
  })
  const [showError, setShowError] = React.useState(false)

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

  const handleSearch = async () => {
    if (conditions.Projects.length === 0) {
      setShowError(true)
    }
    else {
      setShowError(false)
      const params = {
        ProjectIds: conditions.Projects.map(projectName => props.projects.find(project => project.projectName === projectName).projectId),
        CompleteDateFrom: conditions.CompleteDateFrom,
        CompleteDateTo: conditions.CompleteDateTo,
      }
      props.handleSearch(params)
    }
  }

  return (
    <Accordion defaultExpanded={props.projects.length !== 1}>
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
  )
}
export default ConditionsAccordion