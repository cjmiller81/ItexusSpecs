/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  jsconfigPaths: true,
  env: {
    API_BASE_URL: "https://tokensets-api.emergentcybernetics.net",
    ACCESS_TOKEN:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6IjFlMjViNTBkLTVhZjQtNGQ1Zi1hMmM4LTMxOTEyZTBlNzU2ZCIsImV4cCI6MTcxMTU1Mzc4NiwiaXNzIjoieW91cl9pc3N1ZXIiLCJhdWQiOiJ5b3VyX2F1ZGllbmNlIn0.rF6v5SwvKTbmJHzyQAenH9WpMtCWTGV5zfDsaEf5uoA",
  },
}

module.exports = nextConfig
