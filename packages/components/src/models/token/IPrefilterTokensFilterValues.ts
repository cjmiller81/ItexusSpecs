export interface IPrefilterTokensFilterValues {
    id: string
    text: string
    description?: string | null
    icon: string | null
    isPublic: boolean
    OwnerUserId?: string | null
    isPublished: boolean
    accessPlanName?: string | null
    filter: object[]
  }