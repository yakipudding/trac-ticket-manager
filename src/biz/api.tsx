import { apiconfig } from '../settings/apiconfig'
import axios from 'axios'

export const get = async (url:string, option:any = null) => {
  const res = await axios.create(apiconfig).get(url, option)
  return res.data;
}

export const post = async (url:string, data:any) => {
  const res = await axios.create(apiconfig).post(url, data)
  return res.data
}