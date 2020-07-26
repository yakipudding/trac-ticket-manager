import { updateTicketUnvisible } from '../../biz/DBAccessor/tickets-data'

export default async (req: any, res: any) => {
  const ticket = req.body
  await updateTicketUnvisible(ticket)

  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  res.end()
}