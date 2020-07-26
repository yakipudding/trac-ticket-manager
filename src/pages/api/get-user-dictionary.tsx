import { getUserDictionary } from '../../biz/DBAccessor/user-dictionary-data'

export default async (req: any, res: any) => {
  const userDictionary = await getUserDictionary()
  res.status(200).json({ response: { userDictionary: userDictionary } })
}