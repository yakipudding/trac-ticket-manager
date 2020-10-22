import { execQuery } from './connect'
import { TicketInterface } from '../../definitions/ticket-interfaces'

export const getTickets = async (visible?: boolean) => {
  const query = `
    SELECT
      [TicketId]
      ,[TracId]
      ,[Category]
      ,S.[StatusName] AS Status
      ,[Memo]
      ,T.[Visible]
      ,T.[ProjectId]
      ,[Summary]
      ,[Owner]
      ,[FreeField1]
      ,[FreeField2]
      ,[FreeField3]
      ,[FreeField4]
      ,[FreeField5]
      ,[CompleteDate]
      ,[Type]
      ,[Priority]
      ,[Milestone]
      ,[Component]
      ,[Version]
      ,[CreateTime]
      ,[ChangeTime]
      ,[DueAssign]
      ,[DueClose]
      ,[Complete]
      ,[Reporter]
      ,P.[ProjectName]
      ,P.[Url]
    FROM [dbo].[Tickets] T
    LEFT JOIN [StatusDictionary] S
    ON T.[Status] = S.[Status]
    LEFT JOIN [Projects] P
    ON T.[ProjectId] = P.[ProjectId]
    ${visible ? 'WHERE P.Visible = 1 AND T.Visible = 1' : ''}
    ORDER BY T.ProjectId, T.Category, T.DueAssign, T.TicketId
  `
  let result = await execQuery(query)
  // Date型のJSONシリアライズエラーが発生するため変換
  result = JSON.parse(JSON.stringify(result))

  return result
}

export const getAllTickets = async (projectIds: string[], completeDateFrom: string, completeDateTo: string) => {
  const params = [
    { field: "CompleteDateFrom", value: completeDateFrom === '' ? null : completeDateFrom },
    { field: "CompleteDateTo", value: completeDateTo === '' ? null : completeDateTo }
  ]

  const query = `
    SELECT
      [TicketId]
      ,[TracId]
      ,[Category]
      ,S.[StatusName] AS Status
      ,[Memo]
      ,T.[Visible]
      ,T.[ProjectId]
      ,[Summary]
      ,[Owner]
      ,[FreeField1]
      ,[FreeField2]
      ,[FreeField3]
      ,[FreeField4]
      ,[FreeField5]
      ,[CompleteDate]
      ,[Type]
      ,[Priority]
      ,[Milestone]
      ,[Component]
      ,[Version]
      ,[CreateTime]
      ,[ChangeTime]
      ,[DueAssign]
      ,[DueClose]
      ,[Complete]
      ,[Reporter]
      ,P.[ProjectName]
      ,P.[Url]
    FROM [dbo].[Tickets] T
    LEFT JOIN [StatusDictionary] S
    ON T.[Status] = S.[Status]
    LEFT JOIN [Projects] P
    ON T.[ProjectId] = P.[ProjectId]
    WHERE T.[ProjectId] IN (${projectIds.join(',')})
    AND (@CompleteDateFrom IS NULL OR T.[CompleteDate] >= @CompleteDateFrom)
    AND (@CompleteDateTo IS NULL OR T.[CompleteDate] <= @CompleteDateTo)
    ORDER BY T.[CompleteDate] DESC
  `
  let result = await execQuery(query, params)
  // Date型のJSONシリアライズエラーが発生するため変換
  result = JSON.parse(JSON.stringify(result))

  return result
}

export const insertTicket = async ( ticket: TicketInterface ) => {
  const params = [
    { field: "TracId", value: ticket.TracId },
    { field: "Category", value: ticket.Category },
    { field: "Memo", value: ticket.Memo },
    { field: "ProjectId", value: ticket.ProjectId },
  ]
  const query = `
    INSERT INTO [dbo].[Tickets]
    ([TracId]
    ,[Category]
    ,[Memo]
    ,[Visible]
    ,[ProjectId])
  VALUES
    (@TracId
    ,@Category
    ,@Memo
    ,1
    ,@ProjectId
  )
  `
  execQuery(query, params)

  return true
}

export const updateTicketByTable = async ( ticket: TicketInterface ) => {
  const params = [
    { field: 'TicketId', value: ticket.TicketId },
    { field: "Category", value: ticket.Category },
    { field: "Memo", value: ticket.Memo },
    { field: "Visible", value: ticket.Visible },
  ]
  const query = `
    UPDATE [dbo].[Tickets]
    SET
       [Category] = @Category
      ,[Memo] = @Memo
      ,[Visible] = @Visible
    WHERE TicketId = @TicketId
  `
  execQuery(query, params)

  return true
}

export const updateTicketUnvisible = async ( ticket: TicketInterface ) => {
  const params = [
    { field: 'TicketId', value: ticket.TicketId }
  ]
  const query = `
    UPDATE [dbo].[Tickets]
    SET
       [Visible] = 0
      ,[CompleteDate] = GETDATE()
    WHERE TicketId = @TicketId
  `
  execQuery(query, params)

  return true
}

export const updateTicketByTrac = async ( ticket: TicketInterface ) => {
  const params = [
    { field: 'TicketId', value: ticket.TicketId },
    { field: "Category", value: ticket.Category },
    { field: "Status", value: ticket.Status },
    { field: "Visible", value: ticket.Visible },
    { field: "ProjectId", value: ticket.ProjectId },
    { field: "Summary", value: ticket.Summary },
    { field: "Owner", value: ticket.Owner },
    { field: "FreeField1", value: ticket.FreeField1 },
    { field: "FreeField2", value: ticket.FreeField2 },
    { field: "FreeField3", value: ticket.FreeField3 },
    { field: "FreeField4", value: ticket.FreeField4 },
    { field: "FreeField5", value: ticket.FreeField5 },
    { field: "CompleteDate", value: ticket.CompleteDate },
    { field: "Type", value: ticket.Type },
    { field: "Priority", value: ticket.Priority },
    { field: "Milestone", value: ticket.Milestone },
    { field: "Component", value: ticket.Component },
    { field: "Version", value: ticket.Version },
    { field: "CreateTime", value: ticket.CreateTime },
    { field: "ChangeTime", value: ticket.ChangeTime },
    { field: "DueAssign", value: ticket.DueAssign },
    { field: "DueClose", value: ticket.DueClose },
    { field: "Complete", value: ticket.Complete },
    { field: "Reporter", value: ticket.Reporter },
  ]
  const query = `
    UPDATE [dbo].[Tickets]
    SET
       [Category] = @Category
      ,[Status] = @Status
      ,[Visible] = @Visible
      ,[ProjectId] = @ProjectId
      ,[Summary] = @Summary
      ,[Owner] = @Owner
      ,[FreeField1] = @FreeField1
      ,[FreeField2] = @FreeField2
      ,[FreeField3] = @FreeField3
      ,[FreeField4] = @FreeField4
      ,[FreeField5] = @FreeField5
      ,[CompleteDate] = @CompleteDate
      ,[Type] = @Type
      ,[Priority] = @Priority
      ,[Milestone] = @Milestone
      ,[Component] = @Component
      ,[Version] = @Version
      ,[CreateTime] = @CreateTime
      ,[ChangeTime] = @ChangeTime
      ,[DueAssign] = @DueAssign
      ,[DueClose] = @DueClose
      ,[Complete] = @Complete
      ,[Reporter] = @Reporter
    WHERE TicketId = @TicketId
  `
  execQuery(query, params)

  return true
}

export const updateTicketsCategory = async ( params: { ticketIds: string[], category: string } ) => {
  const queryParams = [
    { field: "Category", value: params.category }
  ]
  const query = `
    UPDATE [dbo].[Tickets]
    SET
       [Category] = @Category
    WHERE TicketId IN (${ params.ticketIds.join(",")})
  `
  execQuery(query, queryParams)

  return true
}

export const updateTicketsUnvisible = async (ticketIds: string[]) => {
  const query = `
    UPDATE [dbo].[Tickets]
    SET
       [Visible] = 0
      ,[CompleteDate] = GETDATE()
    WHERE TicketId IN (${ ticketIds.join(",")})
  `
  execQuery(query)

  return true
}

export const deleteTicket = async ( ticket: TicketInterface ) => {
  const params = [
    { field: 'TicketId', value: ticket.TicketId }
  ]
  const query = `
    DELETE [dbo].[Tickets]
    WHERE TicketId = @TicketId
  `
  execQuery(query, params)

  return true
}