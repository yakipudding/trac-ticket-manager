import { execQuery } from './connect'
import { CategorySettingInterface } from '../../definitions/setting-interfaces'

export const getCategorySetting = async () => {
  const query = `
    SELECT [CategorySettingId]
          ,[Word]
          ,[Category]
          ,[Priority]
    FROM [dbo].[CategorySettings]
    ORDER BY [Priority]
  `
  return execQuery(query)
}

export const insertCategorySetting = async ( CategorySetting: CategorySettingInterface ) => {
  const params = [
    { field: 'Word', value: CategorySetting.Word },
    { field: 'Category', value: CategorySetting.Category },
    { field: 'Priority', value: CategorySetting.Priority },
  ]
  const query = `
    INSERT INTO [dbo].[CategorySettings]
      ([Word]
      ,[Category]
      ,[Priority])
    VALUES (
       @Word
      ,@Category
      ,@Priority
    )
  `
  execQuery(query, params)

  return true
}

export const updateCategorySetting = async ( CategorySetting: CategorySettingInterface ) => {
  const params = [
    { field: 'CategorySettingId', value: CategorySetting.CategorySettingId },
    { field: 'Word', value: CategorySetting.Word },
    { field: 'Category', value: CategorySetting.Category },
    { field: 'Priority', value: CategorySetting.Priority },
  ]
  const query = `
    UPDATE [dbo].[CategorySettings]
    SET
       [Word] = @Word
      ,[Category] = @Category
      ,[Priority] = @Priority
    WHERE CategorySettingId = @CategorySettingId
  `
  execQuery(query, params)

  return true
}

export const deleteCategorySetting = async ( CategorySettingId: number ) => {
  const params = [
    { field: 'CategorySettingId', value: CategorySettingId },
  ]
  const query = `
    DELETE [dbo].[CategorySettings]
    WHERE CategorySettingId = @CategorySettingId
  `
  execQuery(query, params)

  return true
}