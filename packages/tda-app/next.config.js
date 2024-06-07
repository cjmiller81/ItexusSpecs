/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  modularizeImports: {
    '@mui/material': {
      transform: '@mui/material/{{member}}'
    },
    '@mui/lab': {
      transform: '@mui/lab/{{member}}'
    }
  },
  webpack: (config, { isServer, defaultLoaders }) => {
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

    config.module.rules.push(
      {
        test: /\.svg$/,
        use: [
          defaultLoaders.babel,
          {
            loader: '@svgr/webpack',
            options: { babel: false },
          },
        ],
      },
    );

    return {
      ...config,
      optimization: {
        // TODO: Enable for production. This is just to track down build errors.
        minimize: false,
      },
    };
  },
  env: {
    API_BASE_URL: "https://tokensets-api.emergentcybernetics.net",
    NEXT_PUBLIC_API_BASE_URL: "https://tokensets-api.emergentcybernetics.net",
    NEXT_PUBLIC_MOCK_BACKEND_API: "false",
    ACCESS_TOKEN:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6IjFlMjViNTBkLTVhZjQtNGQ1Zi1hMmM4LTMxOTEyZTBlNzU2ZCIsInByX2NhblVwbG9hZEZpbGUiOiJjYW5VcGxvYWRGaWxlIiwicHJfYWRtaW4iOiJhZG1pbiIsImV4cCI6MTcxODQ4ODE3NywiaXNzIjoiand0X2FwaV9pc3N1ZXIiLCJhdWQiOiJqd3RfYXBpX2F1ZGllbmNlIn0.G_NKEeUe0SpOytyIZ70Le09-Z7dlZf6J2PY3Ez_xY-Q",
    NEXT_PUBLIC_ORY_SDK_URL: 'https://trading-tools-auth.emergentcybernetics.net',
    ORY_SDK_URL: 'https://trading-tools-auth.emergentcybernetics.net',
    NEXT_APP_VERSION: process.env.REACT_APP_VERSION,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET_KEY,
    NEXTAUTH_SECRET_KEY: process.env.NEXTAUTH_SECRET_KEY,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXT_APP_API_URL: process.env.REACT_APP_API_URL,
    NEXT_APP_JWT_SECRET: process.env.REACT_APP_JWT_SECRET,
    NEXT_APP_JWT_TIMEOUT: process.env.REACT_APP_JWT_TIMEOUT,
    NEXT_APP_GOOGLE_MAPS_API_KEY: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    NEXT_APP_MAPBOX_ACCESS_TOKEN: process.env.REACT_APP_MAPBOX_ACCESS_TOKEN,

    //BACKEND_API_URL: 'https://tda-api.emergentcybernetics.net',
    //NEXT_PUBLIC_BACKEND_API_URL: 'https://tda-api.emergentcybernetics.net',
    BACKEND_API_URL: 'https://local.emergentcybernetics.net:7163',
    NEXT_PUBLIC_BACKEND_API_URL: 'https://local.emergentcybernetics.net:7163',

    BACKEND_API_TOKEN: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6IjFlMjViNTBkLTVhZjQtNGQ1Zi1hMmM4LTMxOTEyZTBlNzU2ZCIsInByX2FkbWluIjoiYWRtaW4iLCJwcl9PcnlDYW5BZG1pblVzZXJzIjoiT3J5Q2FuQWRtaW5Vc2VycyIsInByX0NvdW50ZXJQYXJ0eUlkIjoiRUNfVEVTVCIsImV4cCI6MTcyMDMwODUxOCwiaXNzIjoiand0X2FwaV9pc3N1ZXIiLCJhdWQiOiJqd3RfYXBpX2F1ZGllbmNlIn0.KrryOcwgrDj2GkgP30DxacjKKnrvshoSBuIHJTSJOR0',
    NEXT_PUBLIC_BACKEND_API_TOKEN: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6IjFlMjViNTBkLTVhZjQtNGQ1Zi1hMmM4LTMxOTEyZTBlNzU2ZCIsInByX2FkbWluIjoiYWRtaW4iLCJwcl9PcnlDYW5BZG1pblVzZXJzIjoiT3J5Q2FuQWRtaW5Vc2VycyIsInByX0NvdW50ZXJQYXJ0eUlkIjoiRUNfVEVTVCIsImV4cCI6MTcyMDMwODUxOCwiaXNzIjoiand0X2FwaV9pc3N1ZXIiLCJhdWQiOiJqd3RfYXBpX2F1ZGllbmNlIn0.KrryOcwgrDj2GkgP30DxacjKKnrvshoSBuIHJTSJOR0',

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
