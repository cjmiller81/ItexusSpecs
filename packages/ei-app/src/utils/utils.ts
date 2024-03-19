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
