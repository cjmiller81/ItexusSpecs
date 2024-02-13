import * as React from 'react'

interface Props {
  children: any
}

export default function PageTitle({ children }: Props) {
  return <h1>{children}</h1>
}
