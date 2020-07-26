import { getProjects } from '../../biz/DBAccessor/projects-data'

export default async (req: any, res: any) => {
  const visible = req.query.visible as boolean
  const projects = await getProjects(visible)
  res.status(200).json({ response: { projects: projects } })
}