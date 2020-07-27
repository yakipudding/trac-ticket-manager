CREATE TYPE [dbo].[TracTicketTVP] AS TABLE(
	[TracId] [int] NOT NULL,
	[Summary] [nvarchar](max) NULL,
	[Status] [nvarchar](max) NULL,
	[Owner] [nvarchar](max) NULL,
	[Type] [nvarchar](50) NULL,
	[Priority] [nvarchar](50) NULL,
	[Milestone] [nvarchar](50) NULL,
	[Component] [nvarchar](50) NULL,
	[Version] [nvarchar](50) NULL,
	[CreateTime] [nvarchar](50) NULL,
	[ChangeTime] [nvarchar](50) NULL,
	[DueAssign] [nvarchar](50) NULL,
	[DueClose] [nvarchar](50) NULL,
	[Complete] [int] NULL,
	[Reporter] [nvarchar](50) NULL,
	[FreeField1] [nvarchar](max) NULL,
	[FreeField2] [nvarchar](max) NULL,
	[FreeField3] [nvarchar](max) NULL,
	[FreeField4] [nvarchar](max) NULL,
	[FreeField5] [nvarchar](max) NULL
)
GO