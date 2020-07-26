import { ValueType } from './types'

export interface UserDictionaryInterface {
  UserId: number,
  User: string,
  UserName: string,
  Priority: number,
  type?: ValueType,
  [key: string]: any,
}

export interface CategorySettingInterface {
  CategorySettingId: number,
  Word: string,
  Category: string,
  Priority: number,
  type?: ValueType,
  [key: string]: any,
}