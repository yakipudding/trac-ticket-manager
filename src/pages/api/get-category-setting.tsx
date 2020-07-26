import { getCategorySetting } from '../../biz/DBAccessor/category-setting-data'

export default async (req: any, res: any) => {
  const categorySetting = await getCategorySetting()
  res.status(200).json({ response: { categorySetting: categorySetting } })
}