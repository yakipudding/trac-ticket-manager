import { dbconfig } from '../../settings/dbconfig'
const sql = require('mssql')
const pool = new sql.ConnectionPool(dbconfig);
const poolConnect = pool.connect();

interface ParamsInterfacce {
  field: string,
  value: any,
}

export const execQuery = async (query: string, params?: ParamsInterfacce[]) => {  
  await poolConnect

  try {
    let req = pool.request()
    if(params){
      params.forEach((param) => {
        req = req.input(param.field, param.value)
      })
    }
    const result = await req.query(query)

    return result.recordset

  } catch (err) {
      console.log(err)
      return null
  }
}

export const execProc = async (procName: string, params?: ParamsInterfacce[]) => {  
  await poolConnect

  try {
    let req = pool.request()
    if(params){
      params.forEach((param) => {
        req = req.input(param.field, param.value)
      })
    }

    const result = await req.execute(procName)
    return result.recordset

  } catch (err) {
      console.log(err)
      return null
  }
}