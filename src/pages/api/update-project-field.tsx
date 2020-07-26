import { updateProjectField } from '../../biz/DBAccessor/project-fields-data'

export default async (req: any, res: any) => {
  const projectInfo = req.body
  await updateProjectField(projectInfo)

  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  res.end()
}