SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE FUNCTION [dbo].[fc_ReplaceOwnerName]
(
	@p_Owner nvarchar(MAX)
)
RETURNS nvarchar(MAX)
AS
BEGIN
	DECLARE @ReplacedOwnerName nvarchar(MAX) = @p_Owner
			,@User nvarchar(50) = ''
			,@UserName nvarchar(50) = ''

	DECLARE crUserDict CURSOR FOR
	   SELECT [User],
			  [UserName]
	   FROM   dbo.UserDictionary
	   ORDER BY [Priority]

	OPEN crUserDict;

	FETCH NEXT FROM crUserDict
	INTO @User, @UserName;

	WHILE @@FETCH_STATUS = 0
	BEGIN

	   SET @ReplacedOwnerName = REPLACE(@ReplacedOwnerName, @User, @UserName)

	   FETCH NEXT FROM crUserDict
	   INTO @User, @UserName;

	END

	CLOSE crUserDict;
	DEALLOCATE crUserDict;

	RETURN @ReplacedOwnerName

END
GO
