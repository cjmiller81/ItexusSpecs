/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
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

    config.optimization = {
      ...config.optimization,
      // TODO: Enable for production. This is just to track down build errors.
      minimize: false,
    };

    return config;
  },
  env: {
    BACKEND_API_URL: process.env.BACKEND_API_URL,
    NEXT_PUBLIC_MOCK_BACKEND_API: process.env.NEXT_PUBLIC_MOCK_BACKEND_API,
    ORY_SDK_URL: process.env.ORY_SDK_URL,
    TRADIND_VIEW_NEWS_IMAGES_API: process.env.TRADIND_VIEW_NEWS_IMAGES_API,
    NEWS_ICONS_URL: process.env.NEWS_ICONS_URL,
    APP_VERSION: process.env.APP_VERSION,
    LAMA_PROJECT_ICONS_URL: process.env.LAMA_PROJECT_ICONS_URL
  },
  transpilePackages: ['@mui/icons-material', 'components'],
}

module.exports = nextConfig
