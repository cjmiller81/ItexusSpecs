import React, { FC } from 'react'

import { PrefilterTokensTable } from './prefilter-tokens-table/prefilter-tokens-table'
import { IPrefilterTokens } from './prefilter-tokens.types'

import styles from './prefilter-tokens.module.scss'

export const PrefilterTokens: FC<IPrefilterTokens> = ({ tabType, onUpdate }) => {
  return (
    <div className={styles.prefilterTokensContainer}>
      <PrefilterTokensTable tabType={tabType} onUpdate={onUpdate} />
    </div>
  )
}
