import { deleteProject } from '../../biz/DBAccessor/projects-data'

export default async (req: any, res: any) => {
  const project = req.body
  await deleteProject(project)

  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  res.end()
}