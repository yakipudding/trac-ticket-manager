--ログインユーザ作成
USE [master]
GO
CREATE LOGIN [★ユーザ名★] WITH PASSWORD=N'★パスワード★', DEFAULT_DATABASE=[master], CHECK_EXPIRATION=OFF, CHECK_POLICY=OFF
GO
ALTER SERVER ROLE [sysadmin] ADD MEMBER [★ユーザ名★]
GO
USE [★DB名★]
GO
CREATE USER [★ユーザ名★] FOR LOGIN [★ユーザ名★]
GO
USE [★DB名★]
GO
ALTER ROLE [db_owner] ADD MEMBER [★ユーザ名★]
GO
