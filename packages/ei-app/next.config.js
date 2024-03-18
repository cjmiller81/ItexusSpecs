/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  webpack: (config, { isServer }) => {
    // @see: https://github.com/mswjs/msw/issues/1801#issuecomment-1793911389
    if (isServer) {
      // next server build => ignore msw/browser
      if (Array.isArray(config.resolve.alias)) { // in Next the type is always object, so this branch isn't necessary. But to keep TS happy, avoid @ts-ignore and prevent possible future breaking changes it's good to have it
        config.resolve.alias.push({ name: "msw/browser", alias: false })
      } else {
        config.resolve.alias["msw/browser"] = false
      }
    } else {
      // browser => ignore msw/node
      if (Array.isArray(config.resolve.alias)) {
        config.resolve.alias.push({ name: "msw/node", alias: false })
      } else {
        config.resolve.alias["msw/node"] = false
      }
    }

    return config;
  },
  env: {
    API_BASE_URL: "https://tokensets-api.emergentcybernetics.net",
    NEXT_PUBLIC_API_BASE_URL: "https://tokensets-api.emergentcybernetics.net",
    NEXT_PUBLIC_MOCK_BACKEND_API: "true",
    ACCESS_TOKEN:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6IjFlMjViNTBkLTVhZjQtNGQ1Zi1hMmM4LTMxOTEyZTBlNzU2ZCIsImV4cCI6MTcxMTU1Mzc4NiwiaXNzIjoieW91cl9pc3N1ZXIiLCJhdWQiOiJ5b3VyX2F1ZGllbmNlIn0.rF6v5SwvKTbmJHzyQAenH9WpMtCWTGV5zfDsaEf5uoA",
  },
}

module.exports = nextConfig
