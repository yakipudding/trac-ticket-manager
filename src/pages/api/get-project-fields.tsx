import { getProject } from '../../biz/DBAccessor/projects-data'
import { getProjectFields } from '../../biz/DBAccessor/project-fields-data'

export default async (req: any, res: any) => {
  const projectId = req.query.id as number
  const project = await getProject(projectId)
  const projectFields = await getProjectFields(projectId)
  res.status(200).json(
    { 
      response: { 
        project: project[0],
        projectFields: projectFields
      } 
    } 
  ) 
}