import {
  Box,
  Button,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  SimpleGrid,
  Spacer,
  Spinner,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { dateDiffInDays, getColorValue } from "../utils"

let today = new Date()
let tomorrow = new Date()
tomorrow.setDate(today.getDate() + 1)

function TradingMgmtToolEquityOptions() {
  const [isDirty, setDirty] = useState<boolean>(false)
  const [pendingSync, setPendingSync] = useState<boolean>(false)
  let entryDateInput = useRef() as React.MutableRefObject<HTMLInputElement>
  let expirationDateInput = useRef() as React.MutableRefObject<HTMLInputElement>
  let [size, setSize] = useState<number | string>(-1)
  let [entryDateString, setEntryDateString] = useState<string>(new Date().toISOString().slice(0, 10))
  let [expirationDateString, setExpirationDateString] = useState<string>(tomorrow.toISOString().slice(0, 10))
  let [tradePriceString, setTradePrice] = useState<string>("3.50")
  let [markPriceString, setMarkPrice] = useState<string>("5.50")
  let tradePrice = parseFloat(tradePriceString) || 0
  let markPrice = parseFloat(markPriceString) || 0

  // Computed Values
  let daysHeld = dateDiffInDays(
    new Date(new Date(entryDateString).getTime() + new Date(entryDateString).getTimezoneOffset() * 60 * 1000),
    new Date()
  )
  let daysLeft = dateDiffInDays(
    new Date(),
    new Date(
      new Date(expirationDateString).getTime() + new Date(expirationDateString).getTimezoneOffset() * 60 * 1000
    )
  )
  let pointsDown = tradePrice - markPrice
  let dollarProfitLoss = (typeof size === "number" ? size : parseFloat(size) || 0) * pointsDown * 100 * -1
  let percMaxProfit = tradePrice !== 0 ? (pointsDown / tradePrice) * 100 : 0
  let rollIndicator = daysLeft !== 0 ? pointsDown / daysLeft : 0
  let percTimeHeld = daysHeld + daysLeft !== 0 ? (daysHeld / (daysHeld + daysLeft)) * 100 : 0
  let accelReturn = percTimeHeld !== 0 ? percMaxProfit / percTimeHeld : 0

  // Conditions
  let isProfit = tradePrice >= markPrice
  let isProfitGTE02Points = pointsDown >= 0.2
  let isLT45days = daysLeft <= 45
  let isLT10days = daysLeft <= 10
  let isLT3days = daysLeft <= 3
  let isMarkPriceLTE1 = markPrice <= 1
  let isMarkPriceLTE03 = markPrice <= 0.3
  let isMaxGainGTE50 = percMaxProfit >= 50
  let isMaxGainGTE40 = percMaxProfit >= 40
  let isMaxGainGTE30 = percMaxProfit >= 30
  let isMaxGainGTE20 = percMaxProfit >= 20
  let isAccelReturnGT100 = accelReturn > 1
  let isAccelReturnGT150 = accelReturn > 1.5
  let isAccelReturnGT200 = accelReturn > 2
  let isRollIndicatorLTENeg100 = rollIndicator <= -1
  let isRollIndicatorLTENeg60 = rollIndicator <= -0.6
  let isPointsDownLTE200 = pointsDown >= -2

  // Outcomes
  let { title } = useMemo(() => {
    let title: string = ""

    if (isProfit) {
      if (!isLT45days) {
        if (isMarkPriceLTE1) {
          // 1. CLOSE POSITION
          title = "CLOSE POSITION"
        } else {
          // 2. KEEP POSITION OPEN
          title = "KEEP POSITION OPEN"
        }
      } else if (isLT45days) {
        if (!isLT3days && isMaxGainGTE50) {
          // 3. CLOSE POSITION
          title = "CLOSE POSITION"
        } else if (!isLT10days && !isMaxGainGTE50 && !isMaxGainGTE20) {
          // 4. KEEP POSITION OPEN
          title = "KEEP POSITION OPEN"
        } else if (
          isProfitGTE02Points &&
          !isLT10days &&
          !isMaxGainGTE50 &&
          !isMaxGainGTE30 &&
          isMaxGainGTE20 &&
          isAccelReturnGT200
        ) {
          // 5. CLOSE POSITION
          title = "CLOSE POSITION"
        } else if (
          !isProfitGTE02Points &&
          !isLT10days &&
          !isMaxGainGTE50 &&
          !isMaxGainGTE30 &&
          isMaxGainGTE20 &&
          isAccelReturnGT200
        ) {
          // 6. KEEP POSITION OPEN
          title = "KEEP POSITION OPEN"
        } else if (
          !isLT10days &&
          !isMaxGainGTE30 &&
          isMaxGainGTE20 &&
          isAccelReturnGT100 &&
          !isAccelReturnGT200
        ) {
          // 7. KEEP POSITION OPEN
          title = "KEEP POSITION OPEN"
        } else if (
          !isLT10days &&
          !isMaxGainGTE50 &&
          !isMaxGainGTE40 &&
          isMaxGainGTE30 &&
          isAccelReturnGT100 &&
          !isAccelReturnGT150
        ) {
          // 8. KEEP POSITION OPEN
          title = "KEEP POSITION OPEN"
        } else if (
          !isLT10days &&
          !isMaxGainGTE50 &&
          isMaxGainGTE40 &&
          isMaxGainGTE30 &&
          isAccelReturnGT100 &&
          !isAccelReturnGT150
        ) {
          // 9. CLOSE POSITION
          title = "CLOSE POSITION"
        } else if (
          !isLT10days &&
          !isMaxGainGTE50 &&
          isMaxGainGTE30 &&
          isAccelReturnGT100 &&
          isAccelReturnGT150
        ) {
          // 10. CLOSE POSITION
          title = "CLOSE POSITION"
        } else if (!isLT10days && !isMaxGainGTE50 && isMaxGainGTE20 && !isAccelReturnGT100) {
          // 11. KEEP POSITION OPEN
          title = "KEEP POSITION OPEN"
        } else if (isLT10days && !isLT3days && !isMaxGainGTE50) {
          // 12. CLOSE POSITION
          title = "CLOSE POSITION"
        } else if (isLT10days && isLT3days && isMarkPriceLTE03) {
          // 13. CLOSE POSITION
          title = "CLOSE POSITION"
        }
      }

      if (isLT3days && !isMarkPriceLTE03 && isPointsDownLTE200) {
        // 14. CLOSE POSITION
        title = "CLOSE POSITION"
      }
    } else {
      if (!isLT45days) {
        // 15. KEEP POSITION OPEN
        title = "KEEP POSITION OPEN"
      } else if (isLT45days) {
        if (isRollIndicatorLTENeg100 && !isPointsDownLTE200) {
          // 16. ADJUST POSITION
          title = "ADJUST POSITION"
        } else if (!isRollIndicatorLTENeg100 && isRollIndicatorLTENeg60 && !isPointsDownLTE200) {
          // 17. KEEP POSITION OPEN
          title = "KEEP POSITION OPEN"
        } else if (!isRollIndicatorLTENeg100 && !isRollIndicatorLTENeg60 && !isPointsDownLTE200) {
          // 18. KEEP POSITION OPEN
          title = "KEEP POSITION OPEN"
        } else if (!isLT3days && !isRollIndicatorLTENeg100 && isPointsDownLTE200) {
          // 20. KEEP POSITION OPEN
          title = "KEEP POSITION OPEN"
        }
      }

      if (isLT3days && isPointsDownLTE200) {
        // 19. CLOSE POSITION
        title = "CLOSE POSITION"
      }
    }

    return {
      title: title,
    }
  }, [
    isAccelReturnGT100,
    isAccelReturnGT150,
    isAccelReturnGT200,
    isLT10days,
    isLT3days,
    isLT45days,
    isMarkPriceLTE1,
    isMarkPriceLTE03,
    isMaxGainGTE20,
    isMaxGainGTE30,
    isMaxGainGTE40,
    isMaxGainGTE50,
    isPointsDownLTE200,
    isProfit,
    isProfitGTE02Points,
    isRollIndicatorLTENeg100,
    isRollIndicatorLTENeg60,
  ])

  function handleDateChange(
    setState: React.Dispatch<React.SetStateAction<string>>
  ): (e: React.ChangeEvent<HTMLInputElement>) => void {
    return (e) => {
      setState(e.target.value)
      setDirty(true)
    }
  }

  function handleSizeChange(valueAsString: string, valueAsNumber: number): void {
    if (valueAsString === "-") {
      setSize(valueAsString)
    } else if (isNaN(valueAsNumber)) {
      setSize("")
    } else if (valueAsString === "") {
      setSize(-1)
    } else {
      setSize(valueAsNumber)
    }
    setDirty(true)
  }

  function handleNumberChange(
    setState: React.Dispatch<React.SetStateAction<string>>
  ): (valueAsString: string, valueAsNumber: number) => void {
    return (valueAsString) => {
      if (valueAsString.startsWith("-")) return
      setState(valueAsString)
      setDirty(true)
    }
  }

  const saveToLocalStorage = useCallback((): void => {
    setPendingSync(true)
    localStorage.setItem("equityOptions", JSON.stringify({
      size,
      entryDateString,
      expirationDateString,
      tradePriceString,
      markPriceString
    }))
    setPendingSync(false)
    setDirty(false)
  }, [entryDateString, expirationDateString, markPriceString, size, tradePriceString]);

  function init() {
    const data = localStorage.getItem("equityOptions")
    if (data != null) {
      const formattedData = JSON.parse(data)
      setSize(formattedData.size)
      setEntryDateString(formattedData.entryDateString)
      setExpirationDateString(formattedData.expirationDateString)
      setTradePrice(formattedData.tradePriceString)
      setMarkPrice(formattedData.markPriceString)
    }
  }

  useEffect(() => {
    init()
  }, [])

  return (
    <Box id="trading-tools-twt-container" w="full" bg="#151C32" px="6" py="12">
      <VStack spacing="12" mx="auto" maxW="720px" w="auto">
        <HStack spacing="148px" w="100%">
          <VStack align="start" w="100%">
            <Stack direction={["column", "row"]} w="100%" justifySelf={"flex-start"} alignItems={"center"} spacing="6">
              {/*
              <Heading fontSize="25px" lineHeight="29px" textTransform="uppercase" fontFamily="body">
                Equity Options
              </Heading>
              */}
              <Button
                variant={"primary"}
                size="lg"
                fontSize="13px"
                lineHeight="16px"
                disabled={!isDirty}
                ml="auto !important"
                mr={["auto !important", "0 !important"]}
                onClick={saveToLocalStorage}
              >
                { isDirty ? "Save" : "Saved" }
              </Button>
              {
              pendingSync ?
                <Spinner
                  thickness='4px'
                  speed='0.65s'
                  emptyColor='grey'
                  color='springgreen'
                  size='lg'
                />
                : <></>
              }
            </Stack>
          </VStack>
        </HStack>
        <SimpleGrid columns={[1, 1, 1, 5]} spacing="6" p="6" borderWidth="2px" borderColor="#203864" w="100%">
          <FormControl>
            <FormLabel htmlFor="size">Size</FormLabel>
            <InputGroup>
              <NumberInput
                id="size"
                name="size"
                max={-1}
                min={-10000}
                precision={0}
                step={1}
                value={size}
                allowMouseWheel={true}
                clampValueOnBlur={true}
                keepWithinRange
                onChange={handleSizeChange}
                w="100%"
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </InputGroup>
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="entryDateString">Entry Date</FormLabel>
            <Input
              type="date"
              id="entryDateString"
              name="entryDateString"
              value={entryDateString}
              onChange={handleDateChange(setEntryDateString)}
              ref={entryDateInput}
              w="100%"
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="expirationDateString">Expiration Date</FormLabel>
            <Input
              type="date"
              id="expirationDateString"
              min={entryDateString}
              name="expirationDateString"
              value={expirationDateString}
              onChange={handleDateChange(setExpirationDateString)}
              ref={expirationDateInput}
              w="100%"
            />
            <FormErrorMessage />
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="tradePrice">Trade Price</FormLabel>
            <InputGroup>
              <NumberInput
                id="tradePrice"
                name="tradePrice"
                max={100000.0}
                min={0.0}
                precision={2}
                step={0.01}
                value={tradePriceString}
                allowMouseWheel={true}
                clampValueOnBlur={true}
                keepWithinRange
                onChange={handleNumberChange(setTradePrice)}
                w="100%"
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </InputGroup>
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="markPrice">Mark Price</FormLabel>
            <InputGroup>
              <NumberInput
                id="markPrice"
                name="markPrice"
                max={100000.0}
                min={0.0}
                precision={2}
                step={0.01}
                value={markPriceString}
                allowMouseWheel={true}
                clampValueOnBlur={true}
                keepWithinRange
                onChange={handleNumberChange(setMarkPrice)}
                w="100%"
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </InputGroup>
          </FormControl>
        </SimpleGrid>

        <Stack direction={['column', 'column', 'row']} w="full">
          <Spacer />
          <Box display="flex" mb="5">
            <VStack align="center" spacing="5" width="148px" mb="5">
              <Text textStyle="eyebrow">Days to Expiration</Text>
              <Box layerStyle="callout" color="white">
                { daysLeft ? daysLeft : 0 }
              </Box>
            </VStack>
            <VStack align="center" spacing="5" width="148px" mb="5">
              <Text textStyle="eyebrow">Profit / Loss</Text>
              <Box layerStyle="callout" color={getColorValue(dollarProfitLoss)}>
                {dollarProfitLoss > 0 && "+"}
                {dollarProfitLoss > 0
                  ? "$" + dollarProfitLoss.toFixed(2)
                  : "-$" + dollarProfitLoss.toFixed(2).slice(1)}
              </Box>
            </VStack>
          </Box>
          {dollarProfitLoss < 0 ? (
            <Box display="flex" mb="5">
              <VStack align="center" spacing="5"  width="148px">
                <Text textStyle="eyebrow">Points Down</Text>
                <Box layerStyle="callout" color={getColorValue(pointsDown)}>
                  {pointsDown.toFixed(2)}
                </Box>
              </VStack>
              <VStack align="center" spacing="5"  width="148px">
                <Text textStyle="eyebrow">Roll Indicator</Text>
                <Box layerStyle="callout" color={getColorValue(rollIndicator)}>
                  {rollIndicator > 0 && "+"}
                  {rollIndicator.toFixed(2)}
                </Box>
              </VStack>
            </Box>
          ) : (
            <Box display="flex" mb="5">
              <VStack align="center" spacing="5"  width="148px">
                <Text textStyle="eyebrow">Max Profit %</Text>
                <Box layerStyle="callout" color={getColorValue(percMaxProfit)}>
                  {percMaxProfit.toFixed(2)}%
                </Box>
              </VStack>
              <VStack align="center" spacing="5"  width="148px">
                <Text textStyle="eyebrow">Accel Return</Text>
                <Box layerStyle="callout" color={getColorValue(accelReturn)}>
                  {accelReturn.toFixed(2)} &times;
                </Box>
              </VStack>
            </Box>
          )}
          <Spacer />
        </Stack>

        <Divider borderWidth="1px" borderColor="#203864" />

        <VStack spacing="6" maxW="680px" pb="4">
          <Text fontSize="29px" fontWeight={700} lineHeight="29px" textTransform="uppercase" fontFamily="body">
            {title}
          </Text>
        </VStack>
      </VStack>
    </Box>
  )
}

export default TradingMgmtToolEquityOptions
