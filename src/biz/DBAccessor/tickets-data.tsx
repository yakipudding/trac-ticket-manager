import { execQuery } from './connect'
import { TicketInterface } from '../../definitions/ticket-interfaces'

export const getTickets = async (visible?: boolean) => {
  const query = `
    SELECT
      [TicketId]
      ,[TracId]
      ,[Category]
      ,[Status]
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
      ,CONVERT(varchar(10),[CompleteDate],111) AS [CompleteDate]
      ,[Type]
      ,[Priority]
      ,[Milestone]
      ,[Component]
      ,[Version]
      ,CONVERT(varchar(10),[CreateTime],111) AS [CreateTime]
      ,CONVERT(varchar(10),[ChangeTime],111) AS [ChangeTime]
      ,CONVERT(varchar(10),[DueAssign],111) AS [DueAssign]
      ,CONVERT(varchar(10),[DueClose],111) AS [DueClose]
      ,[Complete]
      ,[Reporter]
      ,CONVERT(varchar(10),[LastOwnerDate],111) AS [LastOwnerDate]
      ,P.[ProjectName]
      ,P.[Url]
    FROM [dbo].[Tickets] T
    LEFT JOIN [Projects] P
    ON T.[ProjectId] = P.[ProjectId]
    ${visible ? 'WHERE P.Visible = 1 AND T.Visible = 1' : ''}
    ORDER BY T.ProjectId, T.Category, T.DueClose, T.DueAssign, T.TicketId
  `
  const result = await execQuery(query)
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
      ,[Status]
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
      ,CONVERT(varchar(10),[CompleteDate],111) AS [CompleteDate]
      ,[Type]
      ,[Priority]
      ,[Milestone]
      ,[Component]
      ,[Version]
      ,CONVERT(varchar(10),[CreateTime],111) AS [CreateTime]
      ,CONVERT(varchar(10),[ChangeTime],111) AS [ChangeTime]
      ,CONVERT(varchar(10),[DueAssign],111) AS [DueAssign]
      ,CONVERT(varchar(10),[DueClose],111) AS [DueClose]
      ,[Complete]
      ,[Reporter]
      ,CONVERT(varchar(10),[LastOwnerDate],111) AS [LastOwnerDate]
      ,P.[ProjectName]
      ,P.[Url]
    FROM [dbo].[Tickets] T
    LEFT JOIN [Projects] P
    ON T.[ProjectId] = P.[ProjectId]
    WHERE T.[ProjectId] IN (${projectIds.join(',')})
    AND (@CompleteDateFrom IS NULL OR T.[CompleteDate] >= @CompleteDateFrom)
    AND (@CompleteDateTo IS NULL OR T.[CompleteDate] <= @CompleteDateTo)
    ORDER BY T.[CompleteDate] DESC
  `
  const result = await execQuery(query, params)
  return result
}

export const getTodayTickets = async () => {
  const query = `
    SELECT
      [TicketId]
      ,[TracId]
      ,[Category]
      ,[Status]
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
      ,CONVERT(varchar(10),[CompleteDate],111) AS [CompleteDate]
      ,[Type]
      ,[Priority]
      ,[Milestone]
      ,[Component]
      ,[Version]
      ,CONVERT(varchar(10),[CreateTime],111) AS [CreateTime]
      ,CONVERT(varchar(10),[ChangeTime],111) AS [ChangeTime]
      ,CONVERT(varchar(10),[DueAssign],111) AS [DueAssign]
      ,CONVERT(varchar(10),[DueClose],111) AS [DueClose]
      ,[Complete]
      ,[Reporter]
      ,CONVERT(varchar(10),[LastOwnerDate],111) AS [LastOwnerDate]
      ,P.[ProjectName]
      ,P.[Url]
    FROM [dbo].[Tickets] T
    LEFT JOIN [Projects] P
    ON T.[ProjectId] = P.[ProjectId]
    WHERE
    (P.TracFlag = 1 AND T.LastOwnerDate = CONVERT(date, GETDATE()))
    OR
    (
      P.TracFlag = 0
      AND
      (
        T.DueAssign IS NULL
        OR
        T.DueClose IS NULL
        OR
        T.DueAssign <= CONVERT(date, GETDATE())
      )
      AND
      (
        T.CompleteDate IS NULL
        OR
        T.CompleteDate = CONVERT(date, GETDATE())
      )
    )
    ORDER BY P.[Order], T.Category, T.DueClose, T.DueAssign, T.TicketId
  `
  const result = await execQuery(query)
  return result
}

export const insertTicket = async ( ticket: TicketInterface ) => {
  const params = [
    { field: "TracId", value: ticket.TracId },
    { field: "Category", value: ticket.Category },
    { field: "Summary", value: ticket.Summary },
    { field: "Status", value: ticket.Status },
    { field: "Memo", value: ticket.Memo },
    { field: "DueAssign", value: ticket.DueAssign },
    { field: "DueClose", value: ticket.DueClose },
    { field: "ProjectId", value: ticket.ProjectId },
  ]
  const query = `
    INSERT INTO [dbo].[Tickets]
    ([TracId]
    ,[Category]
    ,[Summary]
    ,[Status]
    ,[Memo]
    ,[DueAssign]
    ,[DueClose]
    ,[Visible]
    ,[ProjectId]
    ,[LastOwnerDate]
    )
  VALUES
    (ISNULL(@TracId,0)
    ,CASE WHEN @Category = '' THEN NULL ELSE @Category END
    ,@Summary
    ,@Status
    ,@Memo
    ,CASE WHEN @DueAssign = '' THEN NULL ELSE @DueAssign END
    ,CASE WHEN @DueClose = '' THEN NULL ELSE @DueClose END
    ,1
    ,@ProjectId
    ,CONVERT(date, GETDATE())
  )
  `
  execQuery(query, params)

  return true
}

export const updateTicketByTable = async ( ticket: TicketInterface ) => {
  const params = [
    { field: 'TicketId', value: ticket.TicketId },
    { field: "Category", value: ticket.Category },
    { field: "Summary", value: ticket.Summary },
    { field: "Status", value: ticket.Status },
    { field: "Memo", value: ticket.Memo },
    { field: "DueAssign", value: ticket.DueAssign },
    { field: "DueClose", value: ticket.DueClose },
    { field: "Visible", value: ticket.Visible },
  ]
  const query = `
    UPDATE [dbo].[Tickets]
    SET
       [Category] = CASE WHEN @Category = '' THEN NULL ELSE @Category END
      ,[Summary] = @Summary
      ,[Status] = @Status
      ,[Memo] = @Memo
      ,[DueAssign] = CASE WHEN @DueAssign = '' THEN NULL ELSE @DueAssign END
      ,[DueClose] = CASE WHEN @DueClose = '' THEN NULL ELSE @DueClose END
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
      ,[CompleteDate] = CONVERT(date, GETDATE())
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
      ,[CompleteDate] = CONVERT(date, GETDATE())
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