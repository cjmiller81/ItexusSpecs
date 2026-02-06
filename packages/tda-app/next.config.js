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
    ACCESS_TOKEN:
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6IjFlMjViNTBkLTVhZjQtNGQ1Zi1hMmM4LTMxOTEyZTBlNzU2ZCIsInByX3JvbGUiOiJhZG1pbiIsInByX09yeUNhbkFkbWluVXNlcnMiOiJPcnlDYW5BZG1pblVzZXJzIiwicHJfVGFsb3NDYW5BZG1pblVzZXJzIjoiVGFsb3NDYW5BZG1pblVzZXJzIiwicHJfQ291bnRlclBhcnR5SWQiOiJBUElfRUMiLCJleHAiOjE3MjA4MTg4ODksImlzcyI6Imp3dF9hcGlfaXNzdWVyIiwiYXVkIjoiand0X2FwaV9hdWRpZW5jZSJ9.G0ybFmwjGcTc6VhpWcs9c_efNYXPDjiYgklTvQ6IzjQ",
    NEXT_PUBLIC_MOCK_BACKEND_API: process.env.NEXT_PUBLIC_MOCK_BACKEND_API,
    ORY_SDK_URL: process.env.ORY_SDK_URL,
    NEXT_PUBLIC_BACKEND_API_URL:process.env.NEXT_PUBLIC_BACKEND_API_URL,
  },
  transpilePackages: ['@mui/icons-material', 'components', '@ory/elements-react', '@ory/client-fetch'],
}

module.exports = nextConfig
