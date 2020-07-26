import { updateCategorySetting } from '../../biz/DBAccessor/category-setting-data'

export default async (req: any, res: any) => {
  const userDictionary = req.body
  await updateCategorySetting(userDictionary)

  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  res.end()
}