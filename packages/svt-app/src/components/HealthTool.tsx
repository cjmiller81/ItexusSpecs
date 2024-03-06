import {
    Box,
    Divider,
    Heading,
    HStack,
    Spacer,
    Stack,
    Stat,
    StatLabel,
    StatNumber,
    VStack,
  } from "@chakra-ui/react"
import { useEffect } from "react"
import { HealthToolType, Position, TradingPlanSetting, useTradePlanACF } from "../services/useACF"
import {
  formatDollars,
  longStockValuePerAccount,
  totalNotionalExposurePerAccount,
  totalNotionalExposure,
  extrinsicAnnualizedPercents,
  totalBetaWtdDelta,
  betaWtdDeltaPerAccount,
  premiumRatio,
  /*
  longStockNotionalExposure,
  notionalExposure,
  multiplier,
  daysHeld,
  daysLeft,
  cost,
  netLiq,
  extrinsic,
  extrinsicAnnualizedDollar,
  extrinsicAnnualizedPercent,
  plOpen,
  plPercent,
  percentOfTimeHeld,
  positionDelta,
  positionBetaWtdDelta,

  putNotionalExposure,
  extrinsicAnnualizedPuts,
  extrinsicAnnualizedCalls,
  extrinsicAnnualizedTotal,
  callOptionNetLiq,
  putOptionNetLiq,
  */
} from "../utils"
import HealthToolSlider from "./HealthToolSlider"

export default function HealthTool(props: {
  current_account_value: number,
  positions: Position[],
  user_trading_plan: number,
  trading_plan_settings: TradingPlanSetting[],
  trading_plan_title: string,
  dispatch: any
}) {
  //////////////////////////
  // SERVER STATE MANAGEMENT
  //////////////////////////
  const callTradePlanACF = useTradePlanACF({
    onSuccess: (res: { acf: { trading_plan_settings: TradingPlanSetting[], trading_plan_title: string } }) => {
      props.dispatch({
        type: "set_trading_plan_settings",
        payload: {
          trading_plan_settings: res.acf.trading_plan_settings,
          trading_plan_title: res.acf.trading_plan_title
        },
      })
    },
  })

	useEffect(() => {
    callTradePlanACF.mutate(props.user_trading_plan)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.user_trading_plan])

  function getHealthToolSliderDisplayValue(healthToolType: HealthToolType): number {
    let value = 0

    switch(healthToolType) {
      case HealthToolType.LongStockValue:
        value = longStockValuePerAccount(props.positions, props.current_account_value)
        break
      case HealthToolType.NotionalExposure:
        value = totalNotionalExposurePerAccount(props.positions, props.current_account_value)
        break
      case HealthToolType.ExtrinsicAnnualized:
        value = extrinsicAnnualizedPercents(props.positions, props.current_account_value)
        break
      case HealthToolType.BetaWtdDelta:
        value = betaWtdDeltaPerAccount(props.positions, props.current_account_value)
        break
      case HealthToolType.PremiumRatio:
        value = premiumRatio(props.positions)
        break
      default:
        value = 0
        break
    }

    return isNaN(value) ? 0 : value
  }

  function getHealthToolSliderValue(value: number, levelMin: number, levelMax: number): number {
    let offsetBeyond = ((levelMax - levelMin) / 100)

    if (value < levelMin) {
      return levelMin - (offsetBeyond * 22)
    } else if (value > levelMax) {
      return levelMax + (offsetBeyond * 6)
    }

    return value
  }

  function getHealthToolTargetValue(healthToolType: HealthToolType): number {
    let midValue = props.trading_plan_settings.reduce((currentValue, tradingPlan) => {
      if (tradingPlan.health_tool_type === healthToolType) {
        return tradingPlan.level_mid
      }

      return currentValue
    }, 0)

    return +(props.current_account_value * midValue).toFixed(2)
  }

  return (
    <Box id="trading-tools-positions-container" mx="auto" w="full" bg="#151C32" py="32px" px={["32px", "48px"]}>
      <HStack justifySelf={"flex-start"} alignItems={"center"} pb="8" spacing="6">
        <Heading fontSize="19px" lineHeight="23px" fontFamily="body" textTransform={"uppercase"}>
          { props.trading_plan_title }
        </Heading>
        <Spacer />
        {
          /*
        <Button
          variant={"primary"}
          size="lg"
          fontSize="13px"
          lineHeight="16px"
          onClick={() => {
            //dispatch({ type: "do something" })
          }}
        >
          View Trade Plan
        </Button>
          */
        }
      </HStack>

      <Stack direction={['column', 'column', 'row']} justifySelf={"flex-start"} alignItems={"center"} pb="8" spacing="6">
        <HStack justifySelf={"flex-start"} alignItems={"center"} padding="0" spacing="6" overflow="hidden" margin="auto">
          <Spacer />
          {props.trading_plan_settings.map((tradingPlan: TradingPlanSetting, index) => (
            <HealthToolSlider
              key={index}
              title={tradingPlan.health_tool_title}
              value={getHealthToolSliderValue(getHealthToolSliderDisplayValue(tradingPlan.health_tool_type), tradingPlan.level_min, tradingPlan.level_max)}
              displayValue={getHealthToolSliderDisplayValue(tradingPlan.health_tool_type)}
              levelMax={tradingPlan.level_max}
              level75={tradingPlan.level_75}
              levelMid={tradingPlan.level_mid}
              level25={tradingPlan.level_25}
              levelMin={tradingPlan.level_min}
              suffix={tradingPlan.suffix_symbol} />
          ))}
          <Spacer />
        </HStack>
        <Divider height='400' orientation='vertical' display={["none", "none", "block"]} />
        <VStack pl='8'>
          {props.trading_plan_settings.map((tradingPlan: TradingPlanSetting, index) => {
            if (tradingPlan.health_tool_type === HealthToolType.BetaWtdDelta) {
              return (
                <Box w='300px' pb='7' key={index}>
                  <Heading as='h5' size='sm' pb='3' color='white'>Beta Wtd. Delta</Heading>
                  <HStack>
                    <Stat>
                      <StatLabel>Current</StatLabel>
                      <StatNumber color='springgreen'>+{totalBetaWtdDelta(props.positions)}</StatNumber>
                    </Stat>
                    <Stat>
                      <StatLabel color='grey'>Target</StatLabel>
                      <StatNumber color='grey'>+{getHealthToolTargetValue(HealthToolType.BetaWtdDelta)}</StatNumber>
                    </Stat>
                  </HStack>
                </Box>
              )
            } else if (tradingPlan.health_tool_type === HealthToolType.NotionalExposure) {
              return (
                <Box w='300px' pb='7' key={index}>
                  <Heading as='h5' size='sm' pb='3' color='white'>Notional Exposure</Heading>
                  <HStack>
                    <Stat>
                      <StatLabel>Current</StatLabel>
                      <StatNumber color='springgreen'>{formatDollars(Math.round(totalNotionalExposure(props.positions, props.current_account_value)).toString())}</StatNumber>
                    </Stat>
                    <Stat>
                      <StatLabel color='grey'>Target</StatLabel>
                      <StatNumber color='grey'>{formatDollars(Math.round(getHealthToolTargetValue(HealthToolType.NotionalExposure)).toString())}</StatNumber>
                    </Stat>
                  </HStack>
                </Box>
              )
            }

            return ''
          })}
          <Box w='300px' pb='7'>
            <Heading as='h5' size='sm' pb='3' color='white'></Heading>
            <HStack>
              <Stat>
                <StatLabel></StatLabel>
                <StatNumber color='springgreen'></StatNumber>
              </Stat>
              <Stat>
                <StatLabel color='grey'></StatLabel>
                <StatNumber color='grey'></StatNumber>
              </Stat>
            </HStack>
          </Box>
        </VStack>
      </Stack>
      {/*
      <HStack justifySelf={"flex-start"} alignItems={"center"} pb="8" spacing="6">
        <Box w='300px' pb='7'>
          {
            (props.positions.length > 0) ?
            <>
            <Heading as='h3' size='lg' pb='3' color='white'>First Position calcs:</Heading>
            <Heading as='h5' size='sm' pb='3' color='white'>beta: {props.positions[0].beta?.toString()}</Heading>
            <Heading as='h5' size='sm' pb='3' color='white'>multiplier: {multiplier(props.positions[0])}</Heading>
            <Heading as='h5' size='sm' pb='3' color='white'>notionalExposure: {notionalExposure(props.positions[0])}</Heading>
            <Heading as='h5' size='sm' pb='3' color='white'>daysHeld: {daysHeld(props.positions[0])}</Heading>
            <Heading as='h5' size='sm' pb='3' color='white'>daysLeft: {daysLeft(props.positions[0])}</Heading>
            <Heading as='h5' size='sm' pb='3' color='white'>cost: {cost(props.positions[0])}</Heading>
            <Heading as='h5' size='sm' pb='3' color='white'>netLiq: {netLiq(props.positions[0])}</Heading>
            <Heading as='h5' size='sm' pb='3' color='white'>extrinsic: {extrinsic(props.positions[0])}</Heading>
            <Heading as='h5' size='sm' pb='3' color='white'>extrinsicAnnualizedDollar: {extrinsicAnnualizedDollar(props.positions[0])}</Heading>
            <Heading as='h5' size='sm' pb='3' color='white'>extrinsicAnnualizedPercent: {extrinsicAnnualizedPercent(props.positions[0], props.current_account_value)}</Heading>
            <Heading as='h5' size='sm' pb='3' color='white'>plOpen: {plOpen(props.positions[0])}</Heading>
            <Heading as='h5' size='sm' pb='3' color='white'>plPercent: {plPercent(props.positions[0])}</Heading>
            <Heading as='h5' size='sm' pb='3' color='white'>percentOfTimeHeld: {percentOfTimeHeld(props.positions[0])}</Heading>
            <Heading as='h5' size='sm' pb='3' color='white'>positionDelta: {positionDelta(props.positions[0])}</Heading>
            <Heading as='h5' size='sm' pb='3' color='white'>positionBetaWtdDelta: {positionBetaWtdDelta(props.positions[0])}</Heading>
            </>
            : <></>
          }
        </Box>
        <Box w='300px' pb='7'>
          <Heading as='h3' size='lg' pb='3' color='white'>All Positions calcs:</Heading>
          <Heading as='h5' size='sm' pb='3' color='white'>putNotionalExposure: {putNotionalExposure(props.positions)}</Heading>
          <Heading as='h5' size='sm' pb='3' color='white'>longStockNotionalExposure: {longStockNotionalExposure(props.positions)}</Heading>
          <Heading as='h5' size='sm' pb='3' color='white'>longStockValuePerAccount: {longStockValuePerAccount(props.positions, props.current_account_value)}</Heading>
          <Heading as='h5' size='sm' pb='3' color='white'>totalNotionalExposure: {totalNotionalExposure(props.positions, props.current_account_value)}</Heading>
          <Heading as='h5' size='sm' pb='3' color='white'>totalNotionalExposurePerAccount: {totalNotionalExposurePerAccount(props.positions, props.current_account_value)}</Heading>
          <Heading as='h5' size='sm' pb='3' color='white'>extrinsicAnnualizedPuts: {extrinsicAnnualizedPuts(props.positions)}</Heading>
          <Heading as='h5' size='sm' pb='3' color='white'>extrinsicAnnualizedCalls: {extrinsicAnnualizedCalls(props.positions)}</Heading>
          <Heading as='h5' size='sm' pb='3' color='white'>extrinsicAnnualizedTotal: {extrinsicAnnualizedTotal(props.positions)}</Heading>
          <Heading as='h5' size='sm' pb='3' color='white'>extrinsicAnnualizedPercents: {extrinsicAnnualizedPercents(props.positions, props.current_account_value)}</Heading>
          <Heading as='h5' size='sm' pb='3' color='white'>totalBetaWtdDelta: {totalBetaWtdDelta(props.positions)}</Heading>
          <Heading as='h5' size='sm' pb='3' color='white'>betaWtdDeltaPerAccount: {betaWtdDeltaPerAccount(props.positions, props.current_account_value)}</Heading>
          <Heading as='h5' size='sm' pb='3' color='white'>callOptionNetLiq: {callOptionNetLiq(props.positions)}</Heading>
          <Heading as='h5' size='sm' pb='3' color='white'>putOptionNetLiq: {putOptionNetLiq(props.positions)}</Heading>
          <Heading as='h5' size='sm' pb='3' color='white'>premiumRatio: {premiumRatio(props.positions)}</Heading>
        </Box>
      </HStack>
      */}
    </Box>
  )
}
