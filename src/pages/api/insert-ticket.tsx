import { insertTicket } from '../../biz/DBAccessor/tickets-data'

export default async (req: any, res: any) => {
  const ticket = req.body
  await insertTicket(ticket)

  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  res.end()
}