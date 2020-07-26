import { execQuery } from './connect'
import { ProjectInterface } from '../../definitions/project-interfaces'
import { ProjectFieldInterface } from '../../definitions/project-field-interfaces'

export const getProjectFields = async (projectId: number) => {
  const params = [
    { field: 'ProjectId', value: projectId },
  ]
  const query = `
    SELECT [ProjectFieldId]
          ,[Field]
          ,[TracField]
          ,[FieldName]
          ,[Visible]
          ,[ProjectId]
          ,[Order]
    FROM [dbo].[ProjectFields]
    WHERE ProjectId = @ProjectId
    ORDER BY [Order]
  `
  return execQuery(query, params)
}

export const getVisibleProjectFields = async () => {

  const query = `
    SELECT PF.[ProjectFieldId]
      ,PF.[TracField]
      ,PF.[FieldName]
      ,PF.[Visible]
      ,PF.[ProjectId]
      ,PF.[Order]
      ,PF.[Field]
    FROM [dbo].[ProjectFields] PF
    LEFT JOIN Projects P
    ON PF.ProjectId = P.ProjectId
    WHERE P.Visible = 1
    AND   PF.Visible = 1
    ORDER BY PF.ProjectId, PF.[Order]
  `
  return execQuery(query)
}

export const updateProjectField = async ( param: { mode: string, project: ProjectInterface, projectFields: ProjectFieldInterface[] } ) => {
  const params = [
    { field: 'ProjectId', value: param.project.ProjectId },
    { field: 'Url', value: param.project.Url },
    { field: 'UrlConditions', value: param.project.UrlConditions },
    { field: 'UrlColumns', value: param.project.UrlColumns },
    { field: 'UrlColumnsAll', value: param.project.UrlColumnsAll },
  ]
  let query = `
    UPDATE [dbo].[Projects]
    SET
       [Url] = @Url
      ,[UrlConditions] = @UrlConditions
      ,[UrlColumns] = @UrlColumns
      ,[UrlColumnsAll] = @UrlColumnsAll
    WHERE ProjectId = @ProjectId
  `

  param.projectFields.forEach((projectField) => {
    const addQuery = param.mode === 'insert' ?  
    `
      INSERT [dbo].[ProjectFields]
        ([TracField]
        ,[FieldName]
        ,[Visible]
        ,[ProjectId]
        ,[Order]
        ,[Field])
      VALUES
        (N'${projectField.TracField}'
        ,N'${projectField.FieldName}'
        ,${projectField.Visible ? 1 : 0}
        ,${projectField.ProjectId}
        ,${projectField.Order}
        ,N'${projectField.Field}')
    `
    :
    `
      UPDATE [dbo].[ProjectFields]
      SET
         [TracField] = N'${projectField.TracField}'
        ,[FieldName] = N'${projectField.FieldName}'
        ,[Visible] = ${projectField.Visible ? 1 : 0}
        ,[Order] = ${projectField.Order}
      WHERE ProjectFieldId = ${projectField.ProjectFieldId}
    `
    query = query + addQuery
  })
  
  execQuery(query, params)

  return true
}
