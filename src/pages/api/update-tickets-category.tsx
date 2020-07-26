import { updateTicketsCategory } from '../../biz/DBAccessor/tickets-data'

export default async (req: any, res: any) => {
  const params = req.body
  await updateTicketsCategory(params)

  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  res.end()
}