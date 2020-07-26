import { getAllTickets } from '../../biz/DBAccessor/tickets-data'
import { TicketInterface } from '../../definitions/ticket-interfaces'

export default async (req: any, res: any) => {
  const projectIds = req.body.ProjectIds
  const completeDateFrom = req.body.CompleteDateFrom
  const completeDateTo = req.body.CompleteDateTo
  const tickets: TicketInterface[] = await getAllTickets(projectIds, completeDateFrom, completeDateTo)
  
  res.status(200).json(
    { 
      response: { tickets: tickets }
    } 
  ) 
}