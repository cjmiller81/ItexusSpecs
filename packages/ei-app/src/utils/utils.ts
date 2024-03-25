export function getDatesInRange(startDate: Date, endDate: Date): Date[] {
  const dates: Date[] = []
  let currentDate = new Date(startDate)

  while (currentDate <= endDate) {
    dates.push(new Date(currentDate))
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return dates
}

export function getFirstDaysOfWeekInRange(startDate: Date, endDate: Date): Date[] {
  const firstDaysOfWeek: Date[] = []
  let currentDate = new Date(startDate)

  // Find the first day of the week for the startDate
  currentDate.setDate(currentDate.getDate() - currentDate.getDay())

  while (currentDate <= endDate) {
    firstDaysOfWeek.push(new Date(currentDate))
    currentDate.setDate(currentDate.getDate() + 7) // Move to the next week
  }

  return firstDaysOfWeek
}

export function getFirstDaysOfMonthInRange(startDate: Date, endDate: Date): Date[] {
  const firstDaysOfMonth: Date[] = []
  let currentDate = new Date(startDate)
  currentDate.setDate(1) // Set the date to the first day of the month

  while (currentDate <= endDate) {
    firstDaysOfMonth.push(new Date(currentDate))
    currentDate.setMonth(currentDate.getMonth() + 1) // Move to the next month
  }

  return firstDaysOfMonth
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isDeepEqual(obj1: any, obj2: any):boolean {
  if (typeof obj1 !== "object" || obj1 === null || typeof obj2 !== "object" || obj2 === null) {
    return obj1 === obj2
  }

  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)

  if (keys1.length !== keys2.length) {
    return false
  }

  for (const key of keys1) {
    if (!isDeepEqual(obj1[key], obj2[key])) {
      return false
    }
  }

  return true
}
