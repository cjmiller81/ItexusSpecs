import { Identity } from '@ory/client'

export function getUserName(identity: Identity | undefined): string {
  return identity && identity.traits && identity.traits.name ? identity.traits.name.first || identity.traits.email : ''
}
export function getFullName(identity: Identity | undefined): string {
  return identity && identity.traits && identity.traits.name ? `${identity.traits.name.first} ${identity.traits.name.last}` : 'User Name'
}
