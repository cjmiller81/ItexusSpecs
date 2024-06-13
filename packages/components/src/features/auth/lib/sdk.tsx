import { Configuration, FrontendApi } from '@ory/client'
import axios from 'axios'

const oryAxios =  axios.create({
  withCredentials: true,
})
const ory = new FrontendApi(
  new Configuration({
    basePath: process.env.ORY_SDK_URL || '',
  }),
  '',
  oryAxios
)

export { ory }
