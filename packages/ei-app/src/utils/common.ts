export function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function getTodayUtc(): Date {
  return new Date(Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()))
}

export function getYesterdayUtc(): Date {
  const todayUTC = getTodayUtc()
  return new Date(Date.UTC(todayUTC.getFullYear(), todayUTC.getMonth(), todayUTC.getDate() - 1))
}

export function getTomorrowUtc(): Date {
  const todayUTC = getTodayUtc()
  return new Date(Date.UTC(todayUTC.getFullYear(), todayUTC.getMonth(), todayUTC.getDate() + 1))
}
