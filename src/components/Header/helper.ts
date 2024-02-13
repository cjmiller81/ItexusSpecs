const formats = {
  '/profile': 'User Profile',
  '/arbitrage': 'Arbitrage',
  '/income': 'Income',
  '/investing': 'Investing',
  '/trading': 'Trading',
  '/': 'Home',
}

const formatPath = (path: string): string => {
  if (!(path in formats)) {
    return '404'
  }
  // @ts-expect-error
  return formats[path]
}

export { formatPath }
