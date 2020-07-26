import { execQuery } from './connect'
import { ProjectInterface } from '../../definitions/project-interfaces'

export const getProjects = async (visible?: boolean) => {
  const query = `
    SELECT [ProjectId]
          ,[ProjectName]
          ,[Url]
          ,[UrlConditions]
          ,[UrlColumns]
          ,[UrlColumnsAll]
          ,[Order]
          ,[Visible]
    FROM [dbo].[Projects]
    ${visible ? 'WHERE Visible = 1' : ''}
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
  ]
  const query = `
    INSERT INTO [dbo].[Projects]
      ([ProjectName]
      ,[Url]
      ,[UrlConditions]
      ,[UrlColumns]
      ,[UrlColumnsAll]
      ,[Order]
      ,[Visible])
    VALUES (
       @ProjectNamge
      ,NULL
      ,NULL
      ,NULL
      ,NULL
      ,@Order
      ,@Visible
    )
  `
  execQuery(query, params)

  return true
}

export const updateProject = async ( project: ProjectInterface ) => {
  const params = [
    { field: 'ProjectId', value: project.ProjectId },
    { field: 'ProjectNamge', value: project.ProjectName },
    { field: 'Url', value: project.URL },
    { field: 'UrlConditions', value: project.UrlConditions },
    { field: 'UrlColumns', value: project.UrlColumns },
    { field: 'UrlColumnsAll', value: project.UrlColumnsAll },
    { field: 'Order', value: project.Order },
    { field: 'Visible', value: project.Visible },
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