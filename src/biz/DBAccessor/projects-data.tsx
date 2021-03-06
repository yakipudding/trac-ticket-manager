import { execQuery } from './connect'
import { ProjectInterface } from '../../definitions/project-interfaces'

export const getProjects = async (visible?: boolean, tracOnly?: boolean) => {
  const query = `
    SELECT [ProjectId]
          ,[ProjectName]
          ,[Url]
          ,[UrlConditions]
          ,[UrlColumns]
          ,[UrlColumnsAll]
          ,[Order]
          ,[Visible]
          ,[TracFlag]
    FROM [dbo].[Projects]
    WHERE 1 = 1
    ${visible ? 'AND Visible = 1' : ''}
    ${tracOnly ? 'AND TracFlag = 1' : ''}
    ORDER BY [Order]
  `
  return execQuery(query)
}

export const getProject = async ( projectId: number ) => {
  const params = [
    { field: 'ProjectId', value: projectId },
  ]
  const query = `
    SELECT [ProjectId]
          ,[ProjectName]
          ,[Url]
          ,[UrlConditions]
          ,[UrlColumns]
          ,[UrlColumnsAll]
          ,[Order]
          ,[Visible]
          ,[TracFlag]
    FROM [dbo].[Projects]
    WHERE ProjectId = @ProjectId
  `
  return execQuery(query, params)
}

export const getProjectIds = async () => {
  const query = `
  SELECT CONVERT(NVARCHAR(10), [ProjectId]) AS id
  FROM [dbo].[Projects]
  ORDER BY [Order]
  `
  return execQuery(query)
}

export const insertProject = async ( project: ProjectInterface ) => {
  const params = [
    { field: 'ProjectNamge', value: project.ProjectName },
    { field: 'Order', value: project.Order },
    { field: 'Visible', value: project.Visible },
    { field: 'TracFlag', value: project.TracFlag },
  ]
  const query = `
    INSERT INTO [dbo].[Projects]
      ([ProjectName]
      ,[Url]
      ,[UrlConditions]
      ,[UrlColumns]
      ,[UrlColumnsAll]
      ,[Order]
      ,[Visible]
      ,[TracFlag])
    VALUES (
       @ProjectNamge
      ,NULL
      ,NULL
      ,NULL
      ,NULL
      ,@Order
      ,@Visible
      ,@TracFlag
    )
  `
  execQuery(query, params)

  return true
}

export const updateProject = async ( project: ProjectInterface ) => {
  const params = [
    { field: 'ProjectId', value: project.ProjectId },
    { field: 'ProjectNamge', value: project.ProjectName },
    { field: 'Url', value: project.Url },
    { field: 'UrlConditions', value: project.UrlConditions },
    { field: 'UrlColumns', value: project.UrlColumns },
    { field: 'UrlColumnsAll', value: project.UrlColumnsAll },
    { field: 'Order', value: project.Order },
    { field: 'Visible', value: project.Visible },
    { field: 'TracFlag', value: project.TracFlag },
  ]
  const query = `
    UPDATE [dbo].[Projects]
    SET
       [ProjectName] = @ProjectNamge
      ,[Url] = @Url
      ,[UrlConditions] = @UrlConditions
      ,[UrlColumns] = @UrlColumns
      ,[UrlColumnsAll] = @UrlColumnsAll
      ,[Order] = @Order
      ,[Visible] = @Visible
      ,[TracFlag] = @TracFlag
    WHERE ProjectId = @ProjectId
  `
  execQuery(query, params)

  return true
}

export const deleteProject = async ( projectId: number ) => {
  const params = [
    { field: 'ProjectId', value: projectId },
  ]
  const query = `
    DELETE [dbo].[ProjectFields]
    WHERE ProjectId = @ProjectId

    DELETE [dbo].[Tickets]
    WHERE ProjectId = @ProjectId

    DELETE [dbo].[Projects]
    WHERE ProjectId = @ProjectId
  `
  execQuery(query, params)

  return true
}