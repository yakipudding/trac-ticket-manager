-- MymyのDBから移行する場合
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
 CONSTRAINT [PK_dbo.ProjectFields] PRIMARY KEY CLUSTERED 
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

-- 列削除
ALTER TABLE [dbo].[Projects] DROP COLUMN
	[Memo],[DetailMemo]

-- 列名変更
EXEC sp_rename 'Projects.ProjectUrl','Url','COLUMN'
EXEC sp_rename 'Projects.Condition','UrlConditions','COLUMN'
EXEC sp_rename 'Projects.Column','UrlColumns','COLUMN'
EXEC sp_rename 'Projects.OrderIndex','Order','COLUMN'

-- 列追加
ALTER TABLE [dbo].[Projects] ADD
	[Visible] [bit] NOT NULL DEFAULT 1,
	[UrlColumnsAll] [nvarchar](max) NULL

/****** Object:  Table [dbo].[Settings] ******/
DROP TABLE [dbo].[Settings]

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

INSERT INTO [dbo].[StatusDictionary]([Status],[StatusName]) VALUES ('new','起票')
INSERT INTO [dbo].[StatusDictionary]([Status],[StatusName]) VALUES ('assigned','割当')
INSERT INTO [dbo].[StatusDictionary]([Status],[StatusName]) VALUES ('accepted','仕掛')
INSERT INTO [dbo].[StatusDictionary]([Status],[StatusName]) VALUES ('closed','完了')
INSERT INTO [dbo].[StatusDictionary]([Status],[StatusName]) VALUES ('reopened','再開')

/****** Object:  Table [dbo].[Tickets] ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

-- 列削除
ALTER TABLE [dbo].[Tickets] DROP COLUMN
	[Status2],[Link],[Link2],[DetailMemo]
	
-- 列名変更
EXEC sp_rename 'Tickets.Project_ProjectId','ProjectId','COLUMN'

-- 列追加
ALTER TABLE [dbo].[Tickets] ADD
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
	[Reporter] [nvarchar](50) NULL

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

ALTER TABLE [dbo].[ProjectFields]  WITH CHECK ADD  CONSTRAINT [FK_dbo.ProjectFields_dbo.Projects_Project_ProjectId] FOREIGN KEY([ProjectId])
REFERENCES [dbo].[Projects] ([ProjectId])
GO

ALTER TABLE [dbo].[ProjectFields] CHECK CONSTRAINT [FK_dbo.ProjectFields_dbo.Projects_Project_ProjectId]
GO
