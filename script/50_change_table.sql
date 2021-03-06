-- プロジェクトテーブルに列追加
/****** Object:  Table [dbo].[Projects] ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

-- 列追加
ALTER TABLE [dbo].[Projects] ADD
	[TracFlag] [bit] NOT NULL DEFAULT 1

-- テーブル削除
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[StatusDictionary]') AND type in (N'U'))
DROP TABLE [dbo].[StatusDictionary]
GO
