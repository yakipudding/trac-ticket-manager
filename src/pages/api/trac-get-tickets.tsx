import { AxiosRequestConfig } from 'axios'
import axios from 'axios'
import * as CSV from 'csv-string';
import { execProc } from '../../biz/DBAccessor/connect'
import { getProjects } from '../../biz/DBAccessor/projects-data'
import { ProjectInterface } from '../../definitions/project-interfaces'
import { TicketInterface } from '../../definitions/ticket-interfaces'
import { getTickets } from '../../biz/DBAccessor/tickets-data'
const sql = require('mssql')

export default async (req: any, res: any) => {
  const projects: ProjectInterface[] = await getProjects(true)
  const tickets: TicketInterface[] = await getTickets(true)
  
  let promises = projects.map(async (project) => {
    // DBから表示チケット取得
    const dbTickets = tickets.filter(projectField => projectField.ProjectId === project.ProjectId)
    
    // Tracから取得条件のチケット取得
    const config:AxiosRequestConfig = {
      baseURL: project.Url,
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      responseType: 'json'  
    }
    const res = await axios.create(config).get(`${project.Url}${project.UrlConditions}${project.UrlColumnsAll}&format=csv`)
    let tracTicketsByUrl = CSV.parse(res.data);
    tracTicketsByUrl.splice(0,1)
    const tracTicketIds = tracTicketsByUrl.map(tracTicket => tracTicket[0])

    // DBの表示チケットのうちTracから取得されなかったものを取得
    let tracTickets = tracTicketsByUrl
    const dbOnlyTickets = dbTickets.filter(dbTicket => !tracTicketIds.includes(dbTicket.TracId.toString()))
    if(dbOnlyTickets.length !== 0){
      const tracTicketIdsById = dbOnlyTickets.map(ticket => `id=${ticket.TracId.toString()}`)
      const res2 = await axios.create(config).get(`${project.Url}query?${tracTicketIdsById.join('&or&')}${project.UrlColumnsAll}&format=csv`)
      let tracTicketsById = CSV.parse(res2.data);
      tracTicketsById.splice(0,1)
      tracTickets = tracTickets.concat(tracTicketsById)
    }

    const tvp = new sql.Table()
    tvp.columns.add('TracId', sql.Int)
    tvp.columns.add('Summary', sql.NVarChar(200), {nullable: true})
    tvp.columns.add('Status', sql.NVarChar(200), {nullable: true})
    tvp.columns.add('Owner', sql.NVarChar(200), {nullable: true})
    tvp.columns.add('Type', sql.NVarChar(50), {nullable: true})
    tvp.columns.add('Priority', sql.NVarChar(50), {nullable: true})
    tvp.columns.add('Milestone', sql.NVarChar(50), {nullable: true})
    tvp.columns.add('Component', sql.NVarChar(50), {nullable: true})
    tvp.columns.add('Version', sql.NVarChar(200), {nullable: true})
    tvp.columns.add('CreateTime', sql.NVarChar(50), {nullable: true})
    tvp.columns.add('ChangeTime', sql.NVarChar(50), {nullable: true})
    tvp.columns.add('DueAssign', sql.NVarChar(50), {nullable: true})
    tvp.columns.add('DueClose', sql.NVarChar(50), {nullable: true})
    tvp.columns.add('Complete', sql.Int, {nullable: true})
    tvp.columns.add('Reporter', sql.NVarChar(50), {nullable: true})
    tvp.columns.add('FreeField1', sql.NVarChar(200), {nullable: true})
    tvp.columns.add('FreeField2', sql.NVarChar(200), {nullable: true})
    tvp.columns.add('FreeField3', sql.NVarChar(200), {nullable: true})
    tvp.columns.add('FreeField4', sql.NVarChar(200), {nullable: true})
    tvp.columns.add('FreeField5', sql.NVarChar(200), {nullable: true})
    
    tracTickets.forEach(tracTicket => {
      // 要素を20にそろえる
      if(tracTicket.length !== 20){
        const addLength = 20 - tracTicket.length
          for(let i=0; i<addLength; i++){
            tracTicket.push(null)
          }
      }
      tracTicket.map(item => item === '' ? null : item)

      tvp.rows.add(
        tracTicket[0]
       ,tracTicket[1]
       ,tracTicket[2]
       ,tracTicket[3]
       ,tracTicket[4]
       ,tracTicket[5]
       ,tracTicket[6]
       ,tracTicket[7]
       ,tracTicket[8]
       ,tracTicket[9]
       ,tracTicket[10]
       ,tracTicket[11]
       ,tracTicket[12]
       ,tracTicket[13]
       ,tracTicket[14]
       ,tracTicket[15]
       ,tracTicket[16]
       ,tracTicket[17]
       ,tracTicket[18]
       ,tracTicket[19] 
      )
    })
    const params = [
      { field: "ProjectId", value: project.ProjectId },
      { field: "TicketTable", value: tvp },
    ]

    execProc('RegisterTracTicket', params)
  })

  await Promise.all(promises);
  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  res.end()
}