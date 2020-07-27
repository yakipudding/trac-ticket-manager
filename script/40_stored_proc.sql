SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[RegisterTracTicket]
	 @ProjectId int
	,@TicketTable dbo.TracTicketTVP READONLY
AS
BEGIN
	SET NOCOUNT ON;

	DECLARE 
		 @TracId int
		,@Summary nvarchar(200)
		,@Status nvarchar(50)
		,@Owner nvarchar(max)
		,@Type nvarchar(50)
		,@Priority nvarchar(50)
		,@Milestone nvarchar(50)
		,@Component nvarchar(50)
		,@Version nvarchar(50)
		,@CreateTime nvarchar(50)
		,@ChangeTime nvarchar(50)
		,@DueAssign nvarchar(50)
		,@DueClose nvarchar(50)
		,@Complete int
		,@Reporter nvarchar(50)
		,@FreeField1 nvarchar(max)
		,@FreeField2 nvarchar(max)
		,@FreeField3 nvarchar(max)
		,@FreeField4 nvarchar(max)
		,@FreeField5 nvarchar(max)
		,@TicketId int
		,@Visible bit
		,@OldStatus nvarchar(50)

	DECLARE crTicket CURSOR FOR
	   SELECT [TracId]
			,[Summary]
			,[Status]
			,[Owner]
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
			,[FreeField1]
			,[FreeField2]
			,[FreeField3]
			,[FreeField4]
			,[FreeField5]
	   FROM   @TicketTable

	OPEN crTicket
	
	FETCH NEXT FROM crTicket
	INTO @TracId
		,@Summary
		,@Status
		,@Owner
		,@Type
		,@Priority
		,@Milestone
		,@Component
		,@Version
		,@CreateTime
		,@ChangeTime
		,@DueAssign
		,@DueClose
		,@Complete
		,@Reporter
		,@FreeField1
		,@FreeField2
		,@FreeField3
		,@FreeField4
		,@FreeField5

	WHILE @@FETCH_STATUS = 0
	BEGIN
		--リセット
		SELECT @TicketId = NULL

	   --DBに存在するか確認
	   SELECT
	     @TicketId = [TicketId]
		,@Visible = [Visible]
		,@OldStatus = [Status]
	   FROM Tickets
	   WHERE ProjectId = @ProjectId
	   AND TracId = @TracId

	   --存在しない場合：INSERT
	   IF @TicketId IS Null
	   BEGIN
		   DECLARE @Category NVARCHAR(50) = NULL
		   SELECT TOP 1 @Category = Category 
		   FROM [dbo].[CategorySettings]
		   WHERE @Summary LIKE '%' + Word + '%'
		   ORDER BY Priority

		   INSERT INTO [dbo].[Tickets]
			([TracId]
			,[Category]
			,[Status]
			,[Memo]
			,[Visible]
			,[ProjectId]
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
			,[Reporter])
		  VALUES
			(@TracId
			,@Category --Category
			,@Status
			,NULL --Memo
			,1 --Visible
			,@ProjectId
			,@Summary
			,dbo.fc_ReplaceOwnerName(@Owner)
			,@FreeField1
			,@FreeField2
			,@FreeField3
			,@FreeField4
			,@FreeField5
			,NULL --CompleteDate
			,@Type
			,@Priority
			,@Milestone
			,@Component
			,@Version
			,CONVERT(datetime,@CreateTime)
			,CONVERT(datetime,@ChangeTime)
			,CONVERT(datetime,@DueAssign)
			,CONVERT(datetime,@DueClose)
			,@Complete
			,@Reporter
		  )
	   END

	   --存在する場合：UPDATE
	   ELSE
	   BEGIN

			----非表示かつcloseだったチケットがclose以外になったら表示にする
			IF @Visible = 0 AND @OldStatus = 'close' AND @Status <> 'close'
			BEGIN
				SET @Visible = 1
			END

			UPDATE [dbo].[Tickets]
			SET
			   [Status] = @Status
			  ,[Visible] = @Visible
			  ,[ProjectId] = @ProjectId
			  ,[Summary] = @Summary
			  ,[Owner] = dbo.fc_ReplaceOwnerName(@Owner)
			  ,[FreeField1] = @FreeField1
			  ,[FreeField2] = @FreeField2
			  ,[FreeField3] = @FreeField3
			  ,[FreeField4] = @FreeField4
			  ,[FreeField5] = @FreeField5
			  ,[Type] = @Type
			  ,[Priority] = @Priority
			  ,[Milestone] = @Milestone
			  ,[Component] = @Component
			  ,[Version] = @Version
			  ,[CreateTime] = CONVERT(datetime,@CreateTime)
			  ,[ChangeTime] = CONVERT(datetime,@ChangeTime)
			  ,[DueAssign] = CONVERT(datetime,@DueAssign)
			  ,[DueClose] = CONVERT(datetime,@DueClose)
			  ,[Complete] = @Complete
			  ,[Reporter] = @Reporter
			WHERE TicketId = @TicketId

	   END

	   FETCH NEXT FROM crTicket
		INTO @TracId
			,@Summary
			,@Status
			,@Owner
			,@Type
			,@Priority
			,@Milestone
			,@Component
			,@Version
			,@CreateTime
			,@ChangeTime
			,@DueAssign
			,@DueClose
			,@Complete
			,@Reporter
			,@FreeField1
			,@FreeField2
			,@FreeField3
			,@FreeField4
			,@FreeField5

	END

	CLOSE crTicket;
	DEALLOCATE crTicket;

END
GO