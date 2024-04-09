import { appAxios } from '@/libs/axios/customAxios'
import { Configuration, FrontendApi } from '@ory/client'

// Create a new Ory API client
// This will default to the Ory playground project if no environment variable is set.
// Set the `NEXT_PUBLIC_ORY_SDK_URL` to your Ory CLI tunnel e.g. http://localhost:4000
// or on production to the custom domain you have added to your Ory project.
const ory = new FrontendApi(
  new Configuration({
    basePath: process.env.NEXT_PUBLIC_ORY_SDK_URL || '',
  }),
  '',
  // TODO: axios version mismatch. Upgrade Ory deps to fix?
  appAxios as any,
)

export { ory }
