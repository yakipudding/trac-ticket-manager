import { AxiosRequestConfig } from 'axios'
import axios from 'axios'
import * as CSV from 'csv-string';
import { execProc } from '../../biz/DBAccessor/connect'
import { getProject } from '../../biz/DBAccessor/projects-data'
import { ProjectInterface } from '../../definitions/project-interfaces'
import { TicketInterface } from '../../definitions/ticket-interfaces'
const sql = require('mssql')

export default async (req: any, res: any) => {
  const ticket: TicketInterface = req.body
  const projectResultSet = await getProject(ticket.ProjectId)
  const project:ProjectInterface = projectResultSet[0]
    
  // Tracから取得条件のチケット取得
  const config:AxiosRequestConfig = {
    baseURL: project.Url,
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    },
    responseType: 'json'  
  }
  const trac = await axios.create(config).get(`${project.Url}query?id=${ticket.TracId}${project.UrlColumnsAll}&format=csv`)
  let tracTickets = CSV.parse(trac.data);
  tracTickets.splice(0,1)
  const tracTicket = tracTickets[0]

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
    ,"" //milestone
    ,tracTicket[6]
    ,"" //version
    ,tracTicket[7]
    ,tracTicket[8]
    ,tracTicket[9]
    ,tracTicket[10]
    ,"" //complete
    ,tracTicket[11]
    ,tracTicket[12]
    ,tracTicket[13]
    ,tracTicket[14]
    ,tracTicket[15]
    ,tracTicket[16]
    // ,tracTicket[17]
    // ,tracTicket[18]
    // ,tracTicket[19] 
  )

  const params = [
    { field: "ProjectId", value: project.ProjectId },
    { field: "TicketTable", value: tvp },
  ]

  await execProc('RegisterTracTicket', params)
  console.log('exec')

  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  res.end()
  console.log('return')
}