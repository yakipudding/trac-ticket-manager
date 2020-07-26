import { deleteUserDictionary } from '../../biz/DBAccessor/user-dictionary-data'

export default async (req: any, res: any) => {
  const userDictionary = req.body
  await deleteUserDictionary(userDictionary)

  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  res.end()
}