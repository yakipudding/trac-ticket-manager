import { execQuery } from './connect'
import { UserDictionaryInterface } from '../../definitions/setting-interfaces'

export const getUserDictionary = async () => {
  const query = `
    SELECT [UserId]
          ,[User]
          ,[UserName]
          ,[Priority]
    FROM [dbo].[UserDictionary]
    ORDER BY [Priority]
  `
  return execQuery(query)
}

export const insertUserDictionary = async ( userDictionary: UserDictionaryInterface ) => {
  const params = [
    { field: 'User', value: userDictionary.User },
    { field: 'UserName', value: userDictionary.UserName },
    { field: 'Priority', value: userDictionary.Priority },
  ]
  const query = `
    INSERT INTO [dbo].[UserDictionary]
      ([User]
      ,[UserName]
      ,[Priority])
    VALUES (
       @User
      ,@UserName
      ,@Priority
    )
  `
  execQuery(query, params)

  return true
}

export const updateUserDictionary = async ( userDictionary: UserDictionaryInterface ) => {
  const params = [
    { field: 'UserId', value: userDictionary.UserId },
    { field: 'User', value: userDictionary.User },
    { field: 'UserName', value: userDictionary.UserName },
    { field: 'Priority', value: userDictionary.Priority },
  ]
  const query = `
    UPDATE [dbo].[UserDictionary]
    SET
       [User] = @User
      ,[UserName] = @UserName
      ,[Priority] = @Priority
    WHERE UserId = @UserId
  `
  execQuery(query, params)

  return true
}

export const deleteUserDictionary = async ( userId: number ) => {
  const params = [
    { field: 'UserId', value: userId },
  ]
  const query = `
    DELETE [dbo].[UserDictionary]
    WHERE UserId = @UserId
  `
  execQuery(query, params)

  return true
}