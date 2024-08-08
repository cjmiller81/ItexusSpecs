import type { Config } from 'jest'
import nextJest from 'next/jest.js'
import configBase from '../../jest.config.base'

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

const config: Config = {
  ...configBase
}
 
// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config)