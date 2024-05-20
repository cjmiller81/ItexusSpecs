/** @type {import('next').NextConfig} */
const path = require('path');

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

    config.resolve.alias = {
      ...config.resolve.alias,
      // Will make webpack look for these modules in parent directories
      //'components': require.resolve('components'),
      "components": path.resolve(__dirname, "../components/src"),
      //'@mui/icons-material': require.resolve('@mui/icons-material'),
    }

    config.optimization = {
      ...config.optimization,
      // TODO: Enable for production. This is just to track down build errors.
      minimize: true,
    };

    return config;
  },
  env: {
    API_BASE_URL: "https://tokensets-api.emergentcybernetics.net",
    NEXT_PUBLIC_API_BASE_URL: "https://tokensets-api.emergentcybernetics.net",
    NEXT_PUBLIC_MOCK_BACKEND_API: "false",
    ACCESS_TOKEN:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6IjFlMjViNTBkLTVhZjQtNGQ1Zi1hMmM4LTMxOTEyZTBlNzU2ZCIsInByX2NhblVwbG9hZEZpbGUiOiJjYW5VcGxvYWRGaWxlIiwicHJfYWRtaW4iOiJhZG1pbiIsImV4cCI6MTcxODQ4ODE3NywiaXNzIjoiand0X2FwaV9pc3N1ZXIiLCJhdWQiOiJqd3RfYXBpX2F1ZGllbmNlIn0.G_NKEeUe0SpOytyIZ70Le09-Z7dlZf6J2PY3Ez_xY-Q",
    NEXT_PUBLIC_ORY_SDK_URL: 'https://trading-tools-auth.emergentcybernetics.net',
    ORY_SDK_URL: 'https://trading-tools-auth.emergentcybernetics.net',
  },
  transpilePackages: ['@mui/icons-material', 'components'],
  /*
  experimental: {
    optimizePackageImports: [
      '@mui/icons-material',
      'components',
    ],
  },
  */
}

module.exports = nextConfig
