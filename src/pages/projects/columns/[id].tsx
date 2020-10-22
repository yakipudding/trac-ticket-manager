import React from 'react';
import Router from 'next/router'
import MaterialTable from 'material-table';
import { Breadcrumbs, Typography, Link, TextField, Button } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Dialog, DialogActions, DialogContent, DialogContentText } from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { ValueType } from '../../../definitions/types'
import { ProjectInterface } from '../../../definitions/project-interfaces'
import { ProjectFieldInterface } from '../../../definitions/project-field-interfaces'
import { InitProjectFieldColumns } from '../../../definitions/init-project-field-columns'
import { post } from '../../../biz/api'
import { getProjectIds, getProject } from '../../../biz/DBAccessor/projects-data'
import { getProjectFields } from '../../../biz/DBAccessor/project-fields-data'


interface ProjectInfo {
  project: ProjectInterface,
  projectFields: ProjectFieldInterface[]
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& > *': {
        margin: theme.spacing(1),
      },
    },
  }),
);

const columns = [
  { title: '表示順',
    field: 'Order',
    type: 'numeric' as ValueType,
  },
  { title: '項目',
    field: 'TracField',
  },
  { title: '項目名',
    field: 'FieldName',
  },
  { title: '表示',
    field: 'Visible',
    type: 'boolean' as ValueType,
  },
]

export const getStaticPaths = async() => {
  const projectIds = await getProjectIds()

  return {
    paths: projectIds.map((projectId: { id: string }) => { return { params: projectId } }),
    fallback: false,
  }
}

export const getStaticProps = async ( params: { params: { id: string } } ) => {
  const projectId = parseInt(params.params.id)
  const project = await getProject(projectId)
  const projectFields = await getProjectFields(projectId)

  const props = { 
    project: project[0],
    projectFields: projectFields
  } 

  return {
    props
  }
}

export default (props: ProjectInfo) => {
  const classes = useStyles();
  
  const [project, setProject] = React.useState<ProjectInterface>({
    ...props.project,
    CustomQueryUrl: props.project.Url ? `${props.project.Url}${props.project.UrlConditions}${props.project.UrlColumns}` : '',
  });
  const [projectFields, setProjectFields] = React.useState<ProjectFieldInterface[]>(
    props.projectFields,
  );
  const [open, setOpen] = React.useState(false);

  const handleChange = (prop: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    if(prop === 'CustomQueryUrl'){
      // カスタムクエリURLをルート、条件、項目に分割
      const customQueryUrl = event.target.value
      const queryIndex = customQueryUrl.indexOf("query?")
      const colIndex = customQueryUrl.indexOf("&col=")
      const orderIndex = customQueryUrl.indexOf("&order=")

      setProject({ 
        ...project,
        Url: customQueryUrl.substring(0, queryIndex),
        UrlConditions: customQueryUrl.substring(queryIndex, colIndex),
        UrlColumns: customQueryUrl.substring(colIndex, orderIndex),
        CustomQueryUrl: event.target.value,
      });

    }
    else{
      // ルートURL、条件、項目からカスタムクエリURLを作成
      const newProject = { 
        ...project,
        [prop]: event.target.value 
      }

      setProject({ 
        ...newProject,
        CustomQueryUrl: `${newProject.Url}${newProject.UrlConditions}${newProject.UrlColumns}`
      });
    }
  };

  const onClickButton = () => {
    if(projectFields.length !== 0 && !open){
      setOpen(true)
    }
    else{
      CreateTable()
    }
  }

  const ProjectFieldOrderSort = (a: ProjectFieldInterface,b: ProjectFieldInterface) => {
    if(a.Order < b.Order) return -1;
    if(a.Order > b.Order) return 1;
    return 0;
  }

  const CreateTable = () => {
    // URL項目からテーブル作成
    const cols = project.UrlColumns.split("&col=")
    let projectFields = props.projectFields.length === 0 ? InitProjectFieldColumns(props.project.ProjectId) : props.projectFields
    cols.map((col, index) => {
      if(col !== ""){
        let id = projectFields.findIndex(field => field.TracField === col)
        if(id === -1){
          // 見つからないのはカスタムフィールド
          id = projectFields.findIndex(field => !field.Visible && field.Field.startsWith("FreeField"))
          projectFields[id].TracField = col
        }
        projectFields[id].Order = index * 10
        projectFields[id].Visible = true
      }
    })
    projectFields.sort(ProjectFieldOrderSort)
    setProjectFields(projectFields)
    setOpen(false);
  }
  
  const handleDialogClose = () => {
    setOpen(false);
  };

  const onRowUpdate = async (newData : ProjectFieldInterface, oldData : ProjectFieldInterface | undefined) => {
    if (oldData) {
      setProjectFields(prevState => {
        const data = [...prevState];
        data[data.indexOf(oldData)] = newData;
        data.sort(ProjectFieldOrderSort);
        return data;
      });
    }
  }
  
  const onClickRegister = () => {
    const projectUrlColumnsAll = 
      (projectFields
        .sort((a,b) => {
          if(a.OrgOrder < b.OrgOrder) return -1;
          if(a.OrgOrder > b.OrgOrder) return 1;
          return 0;
        })
        .map(projectField => { if(projectField.TracField !== '') return `&col=${projectField.TracField}` }))
      .join("")
    post("/api/update-project-field", 
      {
        mode: props.projectFields.length === 0 ? 'insert' : 'update',
        project: { ...project, UrlColumnsAll: projectUrlColumnsAll },
        projectFields: projectFields, 
      })
    Router.push(`/projects`)
  }

  return (
    <>
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
        <Link color="inherit" href="/projects">
          プロジェクト一覧
        </Link>
        <Typography color="textPrimary">
          {project.ProjectName}
        </Typography>
        <Typography color="textPrimary">
          項目設定
        </Typography>
      </Breadcrumbs>
      <form className={classes.root} noValidate autoComplete="off">        
        <TextField 
          id="trac-custom-query" 
          label="TracカスタムクエリページのURL" 
          placeholder="Tracのカスタムクエリでフィルタとカラムを設定したURLを貼り付けてください"
          value={project.CustomQueryUrl} 
          onChange={handleChange('CustomQueryUrl')} 
          InputLabelProps={{
            shrink: true,
          }}
          fullWidth 
        />
        <TextField 
          id="url" 
          label="URLルート" 
          value={project.Url} 
          onChange={handleChange('Url')} 
          InputLabelProps={{
            shrink: true,
          }}
          fullWidth 
        />
        <TextField 
          id="url-conditions"
          label="URL条件" 
          value={project.UrlConditions} 
          onChange={handleChange('UrlConditions')}
          InputLabelProps={{
            shrink: true,
          }}
          fullWidth 
        />
        <TextField 
          id="url-columns"
          label="URL項目"
          value={project.UrlColumns}
          onChange={handleChange('UrlColumns')}
          InputLabelProps={{
            shrink: true,
          }}
          fullWidth 
        />
        <Button variant="contained" color="primary" onClick={onClickButton}>
          URL項目から項目一覧作成
        </Button>
        <MaterialTable
          title="項目一覧"
          columns={columns}
          data={projectFields}
          options={{
            paging: false,
            rowStyle: rowData => ({
              backgroundColor: rowData.Visible ? '#FFF' : '#EEE'
            }),
          }}
          editable={{
            onRowUpdate: onRowUpdate,
          }}
        />
        <Button variant="contained" color="primary" onClick={onClickRegister} fullWidth>
          登録
        </Button>
      </form>
      
      <Dialog
        open={open}
        onClose={handleDialogClose}
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            項目一覧がリセットされます。よろしいですか？
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={CreateTable} color="primary" autoFocus>
            はい
          </Button>
          <Button onClick={handleDialogClose} color="default">
            キャンセル
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}