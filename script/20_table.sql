-- 新規DBから作成する場合
/****** Object:  Table [dbo].[CategorySettings] ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[CategorySettings](
	[CategorySettingId] [int] IDENTITY(1,1) NOT NULL,
	[Word] [nvarchar](50) NOT NULL,
	[Category] [nvarchar](50) NOT NULL,
	[Priority] [int] NULL
) ON [PRIMARY]
GO

/****** Object:  Table [dbo].[ProjectFields] ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[ProjectFields](
	[ProjectFieldId] [int] IDENTITY(1,1) NOT NULL,
	[TracField] [nvarchar](max) NULL,
	[FieldName] [nvarchar](max) NULL,
	[Visible] [bit] NOT NULL,
	[ProjectId] [int] NULL,
	[Order] [int] NOT NULL,
	[Field] [nvarchar](50) NULL,
 CONSTRAINT [PK_dbo.ProjectCustomFields] PRIMARY KEY CLUSTERED 
(
	[ProjectFieldId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

/****** Object:  Table [dbo].[Projects] ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Projects](
	[ProjectId] [int] IDENTITY(1,1) NOT NULL,
	[ProjectName] [nvarchar](max) NULL,
	[Url] [nvarchar](max) NULL,
	[UrlColumns] [nvarchar](max) NULL,
	[Order] [int] NOT NULL,
	[Visible] [bit] NOT NULL,
	[UrlConditions] [nvarchar](max) NULL,
	[UrlColumnsAll] [nvarchar](max) NULL,
 CONSTRAINT [PK_dbo.Projects] PRIMARY KEY CLUSTERED 
(
	[ProjectId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

/****** Object:  Table [dbo].[StatusDictionary] ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[StatusDictionary](
	[Status] [nvarchar](50) NOT NULL,
	[StatusName] [nvarchar](50) NOT NULL
) ON [PRIMARY]
GO

/****** Object:  Table [dbo].[Tickets] ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Tickets](
	[TicketId] [int] IDENTITY(1,1) NOT NULL,
	[TracId] [int] NOT NULL,
	[Category] [nvarchar](max) NULL,
	[Status] [nvarchar](max) NULL,
	[Memo] [nvarchar](max) NULL,
	[Visible] [bit] NOT NULL,
	[ProjectId] [int] NULL,
	[Summary] [nvarchar](max) NULL,
	[Owner] [nvarchar](max) NULL,
	[FreeField1] [nvarchar](max) NULL,
	[FreeField2] [nvarchar](max) NULL,
	[FreeField3] [nvarchar](max) NULL,
	[FreeField4] [nvarchar](max) NULL,
	[FreeField5] [nvarchar](max) NULL,
	[CompleteDate] [datetime] NULL,
	[Type] [nvarchar](50) NULL,
	[Priority] [nvarchar](50) NULL,
	[Milestone] [nvarchar](50) NULL,
	[Component] [nvarchar](50) NULL,
	[Version] [nvarchar](50) NULL,
	[CreateTime] [datetime] NULL,
	[ChangeTime] [datetime] NULL,
	[DueAssign] [datetime] NULL,
	[DueClose] [datetime] NULL,
	[Complete] [int] NULL,
	[Reporter] [nvarchar](50) NULL,
 CONSTRAINT [PK_dbo.Tickets] PRIMARY KEY CLUSTERED 
(
	[TicketId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

/****** Object:  Table [dbo].[UserDictionary] ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[UserDictionary](
	[UserId] [int] IDENTITY(1,1) NOT NULL,
	[User] [nvarchar](50) NOT NULL,
	[UserName] [nvarchar](50) NOT NULL,
	[Priority] [int] NOT NULL
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[ProjectFields] ADD  DEFAULT ((0)) FOR [Order]
GO

ALTER TABLE [dbo].[Projects] ADD  DEFAULT ((0)) FOR [Order]
GO

ALTER TABLE [dbo].[Projects] ADD  DEFAULT ((1)) FOR [Visible]
GO

ALTER TABLE [dbo].[ProjectFields]  WITH CHECK ADD  CONSTRAINT [FK_dbo.ProjectCustomFields_dbo.Projects_Project_ProjectId] FOREIGN KEY([ProjectId])
REFERENCES [dbo].[Projects] ([ProjectId])
GO

ALTER TABLE [dbo].[ProjectFields] CHECK CONSTRAINT [FK_dbo.ProjectCustomFields_dbo.Projects_Project_ProjectId]
GO

ALTER TABLE [dbo].[Tickets]  WITH CHECK ADD  CONSTRAINT [FK_dbo.Tickets_dbo.Projects_Project_ProjectId] FOREIGN KEY([ProjectId])
REFERENCES [dbo].[Projects] ([ProjectId])
GO

ALTER TABLE [dbo].[Tickets] CHECK CONSTRAINT [FK_dbo.Tickets_dbo.Projects_Project_ProjectId]
GO


