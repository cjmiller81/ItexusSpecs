import { Buffer } from 'buffer';
import CryptoJS from 'crypto-js'
import { isValid } from "date-fns";
import { Position } from '../services/useACF';
import { useEffect, useRef } from 'react';

type ValidColorValue = "positive" | "negative" | ""

export function getColorValue(numericValue: number): ValidColorValue {
  return numericValue === 0
    ? ""
    : numericValue < 0
      ? "negative"
      : "positive"
}

export function isLeapYear(year: number): boolean {
  return year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0);
}

export function daysInYear(year: number): number {
  return isLeapYear(year) ? 366 : 365;
}

export function dateDiffInDays(a: Date, b: Date) {
  const _MS_PER_DAY = 1000 * 60 * 60 * 24;

  // Discard the time and time-zone information.
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

export function formatDateString(dateString: string | null = ""): string {
  var year = dateString?.substring(0, 4);
  var month = dateString?.substring(4, 6);
  var day = dateString?.substring(6, 8);
  var formattedDate = `${year}-${month}-${day}`

  if (isValid(new Date(formattedDate))) {
    return formattedDate
  } else {
    return new Date().toISOString().slice(0, 10)
  }
}

// Local Util Functions
export function stringToNumbers(value: string) {
  return Number(value.replace(/[A-Za-z!@;,#$%^&*()]/g, ""))
}

export function formatDollars(value: string) {
  let numbersWithCommas = new Intl.NumberFormat("en-US").format(stringToNumbers(value))
  return "$" + numbersWithCommas
}

export function formatDollarsCents(value: string) {
  let numbersWithCommas = new Intl.NumberFormat("en-US", {
    style: 'currency',
    currency: 'USD',
  }).format(stringToNumbers(value))

  return numbersWithCommas
}

/**
 * @description Generate dxFeed API Self-Signed Token
 * @see https://kb.dxfeed.com/en/data-access/token-based-authorization.html#javascript-implementation
 */
export function getDxFeedAccessToken() {
  try {
    // TODO: Get these from the WordPress setting?
    //const issuer = process.env.NODE_ENV === "development" ? process.env.REACT_APP_DXFEED_ISSUER : '';
    //const message = process.env.NODE_ENV === "development" ? process.env.REACT_APP_DXFEED_MESSAGE : '';
    //const secret = process.env.NODE_ENV === "development" ? process.env.REACT_APP_DXFEED_SECRET : '';
    const issuer = process.env.REACT_APP_DXFEED_ISSUER;
    const message = process.env.REACT_APP_DXFEED_MESSAGE;
    const secret = process.env.REACT_APP_DXFEED_SECRET;
    const session = 'delayed';
    const days = 1;

    const notBeforeTime = '';
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + days);
    const expirationTime = expirationDate.getTime();
    const issuedAtTime = Date.now();

    const payload = [issuer, session, notBeforeTime, expirationTime, issuedAtTime, message].join(',');

    const encodedPayload = Buffer.from(encodeURI(payload)).toString('base64').split('=')[0];

    const hash = CryptoJS.HmacSHA256(encodedPayload, encodeURI(secret ? secret : ''));

    const signature = CryptoJS.enc.Base64.stringify(hash)
      .split('=')[0]
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    return `${encodedPayload}.${signature}`;
  } catch (err) {
    return Promise.reject(err)
  }
}

function stdTimezoneOffset(asOf: Date):number {
  var jan = new Date(asOf.getFullYear(), 0, 1);
  var jul = new Date(asOf.getFullYear(), 6, 1);
  return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
}

function isDstObserved(asOf: Date):boolean {
  return asOf.getTimezoneOffset() < stdTimezoneOffset(asOf);
}

export function getMidnightCentralTimeDate(dateString: string = ""):Date {
  let newDate = new Date()

  if (dateString === "") {
    dateString = (new Date(newDate.getTime() - (newDate.getTimezoneOffset() * 60000 ))
      .toISOString()
      .split("T")[0]).replaceAll("-", "", )
  }

  let year = parseInt(dateString?.substring(0, 4))
  let month = parseInt(dateString?.substring(4, 6)) - 1
  let day = parseInt(dateString?.substring(6, 8))

  let isDst = isDstObserved(new Date(Date.UTC(year, month, day)))
  let nowIsDst = isDstObserved(newDate)
  let tmzDiff = (newDate.getTimezoneOffset() / 60) - (isDst ? 5 : (nowIsDst ? 5 : 6))

  return new Date(Date.UTC(year, month, day, (isDst ? 5 : 6) + tmzDiff))
}

function getFirstWeekdayOfMonth(asOf: Date):number {
  let month = asOf.getMonth()
  let year = asOf.getFullYear()
  let testDate = new Date(year, month, 1) // First day of month.
  let isWeekDay = false

  while (!isWeekDay) {
    if ([1, 2, 3, 4, 5].indexOf(testDate.getDay()) !== -1) {
      isWeekDay = true
      break
    }

    testDate = new Date(year, month, testDate.getDate() + 1)
  }

  return testDate.getDate()
}

function getLastWeekdayOfMonth(asOf: Date):number {
  let month = asOf.getMonth()
  let year = asOf.getFullYear()
  let testDate = new Date(year, month + 1, 0) // Last day of month.
  let isWeekDay = false

  while (!isWeekDay) {
    if ([1, 2, 3, 4, 5].indexOf(testDate.getDay()) !== -1) {
      isWeekDay = true
      break
    }

    testDate = new Date(year, month, testDate.getDate() - 1)
  }

  return testDate.getDate()
}

/**
 * Get the ES Options week number of the month based on rules:
 *  - Count the number of times a day of week has occurrence up to the given date.
 *  - e.g. 2022-09-14 is the 2nd Wednesday in the month
 *  - e.g. 2022-09-15 is the 3rd Thursday in the month
 *
 * @see: https://www.cmegroup.com/education/brochures-and-handbooks/cme-equity-index-options-on-futures-bloomberg-cheat-sheet.html
 *
 * @param asOf
 *
 * @returns number
 */
function getNumOfDayOfWeekOccurrenceInMonth(asOf: Date):number {
  let incDate = new Date(asOf.getFullYear(), asOf.getMonth(), 1)  // First day of month.
  let weekDayNumber = asOf.getDay()
  let dayCount = 0

  while (incDate <= asOf) {
    if (incDate.getDay() === weekDayNumber){
      dayCount++
    }

    if (incDate >= asOf) {
      break
    }

    incDate = new Date(incDate.getFullYear(), incDate.getMonth(), (incDate.getDate() + 1))
  }

  return dayCount
}

/**
 * Get the week number of the month based on rules:
 *  - Week number doesn't start until there's a week day.
 *  - 1st of month on a Saturday does not count as week 1.
 *  - 1st of month on a Saturday or Sunday will return 0 for the 1st and 2nd of the month dates passed in.
 *  - New week starts on a Monday.
 * Note: CME doesn't use this logic. See `getNumOfDayOfWeekOccurrenceInMonth()` instead.
 *
 * @see: https://stackoverflow.com/a/9608670 - Modified from this, which does work when not following the CME rules.
 *
 * @param asOf
 * @param exact - In this implementation, 6 means "Last week of month", not "Sixth" week in the month.
 *                If you want it to always return the actual week of the month, just pass `exact = true`.
 * @returns number
 */
// eslint-disable-next-line
function getWeekOfMonth(asOf: Date, exact: boolean = true):number {
  let month = asOf.getMonth()
  let year = asOf.getFullYear()
  let firstWeekday = getFirstWeekdayOfMonth(asOf)
  let firstWeekdayDayOfWeek = (new Date(year, month, firstWeekday)).getDay()
  let lastDateOfMonth = getLastWeekdayOfMonth(asOf)
  let index = (firstWeekday === 1) ? 1 : 0 // If month starts on a Weekday, use 1, else 0.
  let weekendOffset = ((firstWeekday === 1) ? -2 // Month starts on Weekday
                    : ((firstWeekday === 2) ? 4 // Month starts on Sunday
                    : 3)) // Month starts on Saturday
  let offsetDate = (asOf.getDate() < firstWeekday) ? 0 : asOf.getDate() + firstWeekdayDayOfWeek + weekendOffset
  let weeksInMonth = index + Math.ceil((lastDateOfMonth + firstWeekday - 7) / 7)
  let week = index + Math.floor(offsetDate / 7)

  if (exact || week < 2 + index) {
    return week
  }

  return week === weeksInMonth ? index + 5 : week;
}

/**
 * Get the date of the month that is the third Friday.
 *
 * @param asOf
 * @returns number
 */
export function getThirdFridayOfMonth(asOf: Date):number {
  let incDate = new Date(asOf.getFullYear(), asOf.getMonth(), 1)  // First day of month.
  let fridayCount = 0

  while (fridayCount < 3) {
    if (incDate.getDay() === 5){
      fridayCount++
    }

    if (fridayCount >= 3) {
      break
    }

    incDate = new Date(incDate.getFullYear(), incDate.getMonth(), (incDate.getDate() + 1))
  }

  return incDate.getDate()
}

/**
 * Given a Date, return the CME quarter code and two digit year.
 * If `asOf` Date is after the third Friday of the last month of the quarter,
 * use the next quarter instead.
 *
 * @example
 *   `10 SEP 2022 = U22`
 * @see: https://www.cmegroup.com/markets/equities/sp/e-mini-sandp500.calendar.html
 *
 * @param asOf
 *
 * @returns string
 */
export function getCurrentQuarterCode(asOf: Date, skipExpired: boolean = true):string {
  let twoDigitYear = parseInt(asOf.getFullYear().toString().substring(2, 4))
  let quarter = Math.floor((asOf.getMonth() + 3) / 3)

  // If on or after the contract expiration, switch to the next quarter.
  if (skipExpired) {
    let isLastMonthOfQuarter = [2, 5, 8, 11].indexOf(asOf.getMonth()) !== -1
    let isOnOrAfterThirdFriday = asOf.getDate() >= getThirdFridayOfMonth(asOf)

    if (isLastMonthOfQuarter && isOnOrAfterThirdFriday) {
      if (quarter === 4) {
        twoDigitYear++
        quarter = 1
      } else {
        quarter++
      }
    }
  }

  let quarterCode = ""
  switch(quarter) {
    case 1:
      // `H` = March
      quarterCode = "H"
      break
    case 2:
      // `M` = June
      quarterCode = "M"
      break
    case 3:
      // `U` = September
      quarterCode = "U"
      break
    case 4:
      // `Z` = Devember
      quarterCode = "Z"
      break
  }

  return `${quarterCode}${twoDigitYear}`
}

/**
 * Given a Date, return the CME month code and two digit year.
 *
 * @example
 *   `10 SEP 2022 = U22`
 * @see: https://www.cmegroup.com/education/brochures-and-handbooks/cme-equity-index-options-on-futures-bloomberg-cheat-sheet.html
 *
 * @param asOf
 *
 * @returns string
 */
function getCurrentMonthCode(asOf: Date):string {
  let twoDigitYear = parseInt(asOf.getFullYear().toString().substring(2, 4))
  let month = asOf.getMonth()

  let monthCode = ""
  switch(month) {
    case 0:
      monthCode = "F" // Jan
      break
    case 1:
      monthCode = "G"// Feb
      break
    case 2:
      monthCode = "H" // Mar
      break
    case 3:
      monthCode = "J" // Apr
      break
    case 4:
      monthCode = "K" // May
      break
    case 5:
      monthCode = "M" // Jun
      break
    case 6:
      monthCode = "N" // Jul
      break
    case 7:
      monthCode = "Q" // Aug
      break
    case 8:
      monthCode = "U" // Sep
      break
    case 9:
      monthCode = "V" // Oct
      break
    case 10:
      monthCode = "X" // Nov
      break
    case 11:
      monthCode = "Z" // Dec
      break
  }

  return `${monthCode}${twoDigitYear}`
}

export function getFutureSymbol(symbol: string):string {
  if (symbol === "/ES") {
    let currentQuarterCode = getCurrentQuarterCode(new Date(
      new Date(
        new Date(new Date().setHours(0, 0, 0, 0)).toLocaleString("en-US", {
          timeZone: "America/Chicago",
        })
      ).setHours(0, 0, 0, 0)
    )) // Offset for timezone
    symbol = `/ES${currentQuarterCode}`
  }

  return symbol
}

/**
 *
 * @see: https://www.cmegroup.com/tools-information/quikstrike/options-calendar.html
 * @param position
 * @returns
 */
export function getFutureOptionsSymbol(position: Position):string {
  let symbol = ""

  if (position.symbol === "/ES") {
    let expDate = getMidnightCentralTimeDate(position.expiration)
    let isLastMonthOfQuarter = [2, 5, 8, 11].indexOf(expDate.getMonth()) !== -1
    let isOnThirdFriday = expDate.getDate() === getThirdFridayOfMonth(expDate)
    let isLastWeekdayOfMonth = getLastWeekdayOfMonth(expDate) === expDate.getDate()
    let currentQuarterCode = getCurrentQuarterCode(expDate, false)
    let currentMonthCode = getCurrentMonthCode(expDate)

    // Is an "end of quarter" month and third friday? Use quarterly code, not skipExpired
    if (isLastMonthOfQuarter && isOnThirdFriday) {
      symbol = `/ES${currentQuarterCode}`
    } else if (isLastWeekdayOfMonth) {
      // Is the Expiration Date the last WEEKDAY (non-weekend) of the month? Use `/EW`
      symbol = `/EW${currentMonthCode}`
    } else {
      // TODO: Figure out week of month. Figure out day of week. Map to codes...
      let weekOfMonth = getNumOfDayOfWeekOccurrenceInMonth(expDate)
      let dayOfWeek = expDate.getDay()

      switch (dayOfWeek) {
        case 0:
          // Sunday: Not valid expiration date
          symbol = ""
          break
        case 1:
          // Monday
          symbol = `/E${weekOfMonth}A${currentMonthCode}`
          break
        case 2:
          // Tuesday
          symbol = `/E${weekOfMonth}B${currentMonthCode}`
          break
        case 3:
          // Wednesday
          symbol = `/E${weekOfMonth}C${currentMonthCode}`
          break
        case 4:
          // Thursday
          symbol = `/E${weekOfMonth}D${currentMonthCode}`
          break
        case 5:
          // Friday
          symbol = `/EW${weekOfMonth}${currentMonthCode}`
          break
        case 6:
          // Saturday: Not valid expiration date
          symbol = ""
          break
      }
    }
  }

  return symbol
}

export function buildPositionSymbol(position: Position, getUnderlying: boolean = false) {
  // TODO: Add support for `/ES:XCME` S&P 500 and `/NQ` Nasdeq 100 futures.
  // TODO: Add support for their options. `./ESZ22C1200:XCME`
  /**
   * @see https://www.cmegroup.com/education/brochures-and-handbooks/cme-equity-index-options-on-futures-bloomberg-cheat-sheet.html
   * @see https://www.cmegroup.com/trading/equity-index/weekly-equity-index-options-on-futures.html
   */

  let symbol = position.symbol

  if (position.symbol.indexOf("/") === 0) {
    let exchange = "XCME"

    if (!getUnderlying && position.trade_type === "options") {
      symbol = `.${getFutureOptionsSymbol(position)}${position.call_put?.toUpperCase().substring(0, 1)}${position.strike_price ? parseFloat(position.strike_price) : ""}:${exchange}`
    } else {
      symbol = `${getFutureSymbol(position.symbol)}:${exchange}`
    }
  } else {
    if (!getUnderlying && position.trade_type === "options") {
      symbol = `.${symbol}${position.expiration?.slice(2)}${position.call_put?.toUpperCase().substring(0, 1)}${position.strike_price ? parseFloat(position.strike_price) : ""}`
    }
  }

  return symbol
}

export function extractSymbol(dxOptionSymbol: string): string {
  let [symbol] = dxOptionSymbol.match(/[a-zA-Z]+/g) as Array<string>
  return symbol
}

export function isFuture(position: Position) {
  return position.trade_type === 'shares' && (buildPositionSymbol(position).indexOf('/') === 0)
}

export function isShares(position: Position) {
  return position.trade_type === 'shares' && (buildPositionSymbol(position).indexOf('/') === -1)
}

export function isEquityOption(position: Position) {
  return position.trade_type !== 'shares' && (buildPositionSymbol(position).indexOf('.') === 0) && (buildPositionSymbol(position).indexOf('/') === -1)
}

export function isFutureOption(position: Position) {
  return position.trade_type !== 'shares' && (buildPositionSymbol(position).indexOf('.') === 0) && (buildPositionSymbol(position).indexOf('/') === 1)
}

/**
 * Equitiy Options:
 *   Multiplier = 100
 * Shares & Futures:
 *   Multiplier = 1
 *
 * @param position
 * @returns
 */
export function multiplier(position: Position): number {
  if (isEquityOption(position)) {
    return 100
  }

  return 1
}

/**
 * Options:
 *   Notional Exposure = (Strike Price - Trade Price) x Size x Multiplier x (-1)
 * Shares:
 *   Notional Exposure = absvalue(Last Price x Size)
 *
 * @param position
 * @returns
 */
export function notionalExposure(position: Position): number {
  if (position.quantity) {
    if (isShares(position)) {
      if (position.mark_price && position.mark_price !== "—") {
        return Math.abs(parseFloat(position.mark_price) * parseFloat(position.quantity))
      }
    } else if (position.strike_price && position.trade_price) {
      return (parseFloat(position.strike_price) - parseFloat(position.trade_price)) * parseFloat(position.quantity) * multiplier(position) * -1
    }
  }

  return 0
}

/**
 * @param position
 * @returns
 */
export function daysHeld(position: Position): number {
  return dateDiffInDays(new Date(formatDateString(position.date_entered)), new Date())
}

/**
 * @param position
 * @returns
 */
export function daysLeft(position: Position): number {
  return dateDiffInDays(new Date(formatDateString(position.date_entered)), new Date(formatDateString(position.expiration)))
}

/**
 * Cost = Size x Trade Price x Multiplier
 *
 * @param position
 */
export function cost(position: Position): number {
  if (position.quantity
    && position.trade_price) {
    return parseFloat(position.quantity) * parseFloat(position.trade_price) * multiplier(position)
  }

  return 0
}

/**
 * Net Liq = Size x Mark Price x Multiplier
 *
 * @param position
 * @returns
 */
export function netLiq(position: Position): number {
  if (position.quantity
    && position.mark_price) {
    return parseFloat(position.quantity) * parseFloat(position.mark_price) * multiplier(position)
  }

  return 0
}

/**
 * PUT Options:
 *   Extrinsic = IF (Underlying Price > Strike)
 *     then Extrinsic = Net Liq x (-1)
 *     else Extrinsic = (Net Liq + (Multiplier x (Strike Price - Underlying Share Price))) x (-1)
 *
 * CALL Options:
 *   Extrinsic = IF (Underlying Price < Strike)
 *     then Extrinsic = Net Liq x (-1)
 *     else Extrinsic = (Net Liq + (Multiplier x (Underlying Share Price - Strike Price))) x (-1)
 *
 * @param position
 * @returns
 */
export function extrinsic(position: Position): number {
  if (true || isEquityOption(position)) {
    if (position.underlying_mark_price && position.strike_price) {
      if (position.call_put === 'put' && parseFloat(position.underlying_mark_price) > parseFloat(position.strike_price)) {
        return netLiq(position) * -1
      }
      else if (position.call_put === 'call' && parseFloat(position.underlying_mark_price) < parseFloat(position.strike_price)) {
        return netLiq(position) * -1
      }

      return (netLiq(position)
          + (multiplier(position)
            * (position.call_put === 'put'
                ? (parseFloat(position.strike_price) - parseFloat(position.underlying_mark_price))
                : (parseFloat(position.underlying_mark_price) - parseFloat(position.strike_price))
            )
          )
        ) * -1
    }
  }

  return 0
}

/**
 * Extrinsic Annualized Dollar = Extrinsic ÷ Days Left x 365
 *
 * @param position
 * @returns
 */
export function extrinsicAnnualizedDollar(position: Position): number {
  if (daysLeft(position) !== 0) {
    return (extrinsic(position) / daysLeft(position)) * daysInYear((new Date(formatDateString(position.expiration))).getFullYear())
  }

  return 0
}

/**
 * Extrinsic Annualized Percent = Extrinsic Annualized Dollar ÷ Account Value
 *
 * @param position
 * @returns
 */
export function extrinsicAnnualizedPercent(position: Position, accountSize: number): number {
  if (accountSize !== 0) {
    return (extrinsicAnnualizedDollar(position) / accountSize) * 100
  }

  return 0
}

/**
 * P/L Open = (Mark Price - Trade Price) x Size x Multiplier
 *
 * @param position
 * @returns
 */
export function plOpen(position: Position): number {
  if (position.trade_price && position.quantity) {
    return (parseFloat(position.mark_price) - parseFloat(position.trade_price)) * parseFloat(position.quantity) * multiplier(position)
  }

  return 0
}

/**
 * P/L Percent = P/L Open ÷ absvalue(Cost)
 *
 * @param position
 * @returns
 */
export function plPercent(position: Position): number {
  if (cost(position) !== 0) {
    return (plOpen(position) / Math.abs(cost(position))) * 100
  }

  return 0
}

/**
 * Percent of Time Held = Days Held ÷ (Days Held + Days Left)
 *
 * @param position
 * @returns
 */
export function percentOfTimeHeld(position: Position): number {
  if ((daysHeld(position) + daysLeft(position)) !== 0 ) {
    return daysHeld(position) / (daysHeld(position) + daysLeft(position))
  }

  return 0
}

/**
 * Options:
 *   Position Delta = Option Delta x Size x Multiplier
 * Shares:
 *   Position Delta = Size
 *
 * @param position
 * @returns
 */
export function positionDelta(position: Position): number {
  if (position.quantity) {
    if (isShares(position)) {
      return parseFloat(position.quantity)
    }

    if (position.option_delta) {
      return parseFloat(position.option_delta) * parseFloat(position.quantity) * multiplier(position)
    }
  }

  return 0
}

/**
 * Options:
 *   Position Beta Wtd Delta = Underlying Share Price / SPY Share Price x Underlying Beta x Position Delta
 *
 * Shares:
 *   Position Beta Wtd Delta = Last Price / SPY Share Price x Stock Beta x Position Delta
 *
 * @param position
 * @returns
 */
export function positionBetaWtdDelta(position: Position): number {
  if (position.trade_type !== 'shares') {
    if (position.underlying_mark_price
      && position.underlying_beta
      && position.option_delta
      && position.spy_mark_price && parseFloat(position.spy_mark_price) !== 0
      ) {
      return (parseFloat(position.underlying_mark_price) / parseFloat(position.spy_mark_price)) * parseFloat(position.underlying_beta) * positionDelta(position)
    }
  } else {
    if (position.mark_price
      && position.beta
      && position.spy_mark_price && parseFloat(position.spy_mark_price) !== 0
    ) {
      return (parseFloat(position.mark_price) / parseFloat(position.spy_mark_price)) * parseFloat(position.beta) * positionDelta(position)
    }
  }

  return 0
}

/**
 * Put Notional Exposure = SUM of Notional Exposure for all Put Option Positions
 *
 * @param positions
 * @returns
 */
export function putNotionalExposure(positions: Position[]): number {
  return positions
    .filter((pos) => pos.trade_type !== "shares" && pos.call_put === "put")
    .reduce((currentValue, pos) => currentValue + notionalExposure(pos), 0 as number)
}

/**
 * Long Stock Notional Exposure = SUM of Notional Exposure for all Stock Positions
 *
 * @param positions
 * @returns
 */
export function longStockNotionalExposure(positions: Position[]): number {
  return +(
    positions
      .filter((pos) => pos.trade_type === "shares")
      .reduce((currentValue, pos) => currentValue + notionalExposure(pos), 0 as number)
  ).toFixed(2)
}

/**
 * Long Stock Value / Acct = Long Stock Notional Exposure ÷ Account Value
 *
 * @param positions
 * @returns
 */
export function longStockValuePerAccount(positions: Position[], accountSize: number): number {
  if (accountSize !== 0) {
    return +((longStockNotionalExposure(positions) / accountSize) * 100).toFixed(2)
  }

  return 0
}

/**
 * Total Long Notional Exposure = (Long Stock Notional Exposure + Put Notional Exposure) ÷ Account Value
 *
 * @param positions
 * @returns
 */
export function totalNotionalExposure(positions: Position[], accountSize: number): number {
  if (accountSize !== 0) {
    return +(longStockNotionalExposure(positions) + putNotionalExposure(positions)).toFixed(2)
  }

  return 0
}

/**
 * Total Long Notional Exposure = (Long Stock Notional Exposure + Put Notional Exposure) ÷ Account Value
 *
 * @param positions
 * @returns
 */
export function totalNotionalExposurePerAccount(positions: Position[], accountSize: number): number {
  if (accountSize !== 0) {
    return +(totalNotionalExposure(positions, accountSize) / accountSize).toFixed(2)
  }

  return 0
}

/**
 * Extrinsic Annualized Puts = SUM of Extrinsic Annualized Dollar for all Put Option Positions
 *
 * @param positions
 * @returns
 */
export function extrinsicAnnualizedPuts(positions: Position[]): number {
  return positions
    .filter((pos) => pos.trade_type !== "shares" && pos.call_put === "put")
    .reduce((currentValue, pos) => currentValue + extrinsicAnnualizedDollar(pos), 0 as number)
}

/**
 * Extrinsic Annualized Calls = SUM of Extrinsic Annualized Dollar for all Call Option Positions
 *
 * @param positions
 * @returns
 */
export function extrinsicAnnualizedCalls(positions: Position[]): number {
  return positions
    .filter((pos) => pos.trade_type !== "shares" && pos.call_put === "call")
    .reduce((currentValue, pos) => currentValue + extrinsicAnnualizedDollar(pos), 0 as number)
}

/**
 * Extrinsic Annualized Total = Extrinsic Annualized Puts + Extrinsic Annualized Calls
 *
 * @param positions
 * @returns
 */
export function extrinsicAnnualizedTotal(positions: Position[]): number {
  return extrinsicAnnualizedPuts(positions) + extrinsicAnnualizedCalls(positions)
}

/**
 * Extrinsic Annualized Percent = Extrinsic Annualized Total ÷ Account Value
 *
 * @param positions
 * @returns
 */
export function extrinsicAnnualizedPercents(positions: Position[], accountSize: number): number {
  if (accountSize !== 0) {
    return +((extrinsicAnnualizedTotal(positions) / accountSize) * 100).toFixed(2)
  }

  return 0
}

/**
 * Total Beta Wtd Delta = SUM of Beta Wtd Delta for ALL Positions
 *
 * @param positions
 * @returns
 */
export function totalBetaWtdDelta(positions: Position[]): number {
  return +(
    positions
      .reduce((currentValue, pos) => currentValue + positionBetaWtdDelta(pos), 0 as number)
  ).toFixed(2)
}

/**
 * Beta Wtd Delta / Acct = Total Beta Wtd Delta ÷ Account Value
 *
 * @param positions
 * @returns
 */
export function betaWtdDeltaPerAccount(positions: Position[], accountSize: number): number {
  if (accountSize !== 0) {
    return +((totalBetaWtdDelta(positions) / accountSize) * 100).toFixed(2)
  }

  return 0
}

/**
 * Call Option Net Liq = SUM of Net Liq for all Call Option Positions
 *
 * @param positions
 * @returns
 */
export function callOptionNetLiq(positions: Position[]): number {
  return positions
    .filter((pos) => pos.trade_type !== "shares" && pos.call_put === "call")
    .reduce((currentValue, pos) => currentValue + netLiq(pos), 0 as number)
}

/**
 * Put Option Net Liq = SUM of Net Liq for all Put Option Positions
 *
 * @param positions
 * @returns
 */
export function putOptionNetLiq(positions: Position[]): number {
  return positions
    .filter((pos) => pos.trade_type !== "shares" && pos.call_put === "put")
    .reduce((currentValue, pos) => currentValue + netLiq(pos), 0 as number)
}

/**
 * Premium Ratio: Calls / Puts = Call Option Net Liq ÷ (Call Option Net Liq + Put Option Net Liq)
 *
 * @param positions
 * @returns
 */
export function premiumRatio(positions: Position[]): number {
  if ((callOptionNetLiq(positions) + putOptionNetLiq(positions)) !== 0) {
    return +((callOptionNetLiq(positions) / (callOptionNetLiq(positions) + putOptionNetLiq(positions))) * 100).toFixed(2)
  }

  return 0
}

export type IntervalFunction = () => ( unknown | void )
/**
 * Hoot to call function on deplay.
 * @see: https://overreacted.io/making-setinterval-declarative-with-react-hooks/
 * @param callback
 * @param delay
 */
export function useInterval(callback: IntervalFunction, delay: number | null) {
  const savedCallback = useRef<IntervalFunction | null>(null)

  // Remember the latest callback.
  useEffect(
    () => {
      if (delay === null) return

      savedCallback.current = callback
    }
  )

  // Set up the interval.
  useEffect(
    () => {
      function tick() {
        if ( savedCallback.current !== null ) {
          savedCallback.current()
        }
      }

      if (delay !== null) {
        let id = setInterval(tick, delay)
        return () => clearInterval(id)
      }
    },
    [delay]
  )
}
