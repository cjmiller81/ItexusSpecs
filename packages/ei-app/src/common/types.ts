import { NextPage } from 'next'
import { Session } from '@ory/client'

export type IAppComponent<P = {}, IP = P> = NextPage<P, IP> & {
  session: Session
}
