import { getProjectIds } from '../../biz/DBAccessor/projects-data'

export default async (req: any, res: any) => {
  const projectIds = await getProjectIds()
  res.status(200).json({ response: projectIds })
}