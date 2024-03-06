import {
    Box,
    Heading,
    HStack,
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderMark,
    Spacer,
    VStack,
  } from "@chakra-ui/react"
  import { HiChevronDown, HiChevronUp } from "react-icons/hi"

export default function HealthToolSlider(props: { title: string, value: number, displayValue: number, levelMax: number, level75: number, levelMid: number, level25:number, levelMin:number, suffix: string }) {
  const dashLineStyles = {
    mt: '2',
    ml: '-8px',
    fontSize: 'sm',
    width: 'sm'
  }

  const labelStyles = {
    pl: '3',
    fontSize: 'sm',
    width: '87px'
  }

  const markStyles = {
    color: 'black',
    ml: '1',
    w: '90px',
    borderTopLeftRadius: "12px",
    borderBottomLeftRadius: "12px",
    borderTopRightRadius: "12px",
    borderBottomRightRadius: "12px",
    backgroundClip: "content-box",
    borderWidth: "0px",
  }

  function getMarkColor(): string {
    if (props.displayValue > props.levelMax) {
      return 'lightcoral'
    } else if (props.displayValue <= props.levelMax && props.displayValue >= props.level75) {
      return 'lightcoral'
    } else if (props.displayValue < props.level75 && props.displayValue > props.levelMid) {
      return 'springgreen'
    } else if (props.displayValue <= props.levelMid && props.displayValue > props.level25) {
      return 'springgreen'
    } else if (props.displayValue <= props.level25 && props.displayValue > props.levelMin) {
      return 'lightsalmon'
    } else if (props.displayValue <= props.levelMin) {
      return 'lightcoral'
    }

    return 'springgreen'
  }

  return (
    <Box w={['55px', '87px']} pb='7'>
      <Slider
        aria-label='slider-ex-6'
        orientation='vertical'
        min={props.levelMin}
        max={props.levelMax}
        step={0.1}
        minH='320'
        minW='24'
        mt='10'
        mb='5'
        isReadOnly
        value={props.value}
      >
        <SliderTrack pb={10}>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderMark value={props.levelMax} {...labelStyles}>
          <HStack
            justifySelf={"flex-start"}
            alignItems={"center"}
            spacing="0" 
            textAlign='center'
          >
            <Spacer />
            <span>{props.levelMax}{props.suffix}</span>
            <Spacer />
          </HStack>
        </SliderMark>
        <SliderMark value={props.level75} {...dashLineStyles}>
        ----------------------
        </SliderMark>
        <SliderMark value={props.levelMid} {...dashLineStyles}>
        ----------------------
        </SliderMark>
        <SliderMark value={props.level25} {...dashLineStyles}>
        ----------------------
        </SliderMark>
        <SliderMark value={props.levelMin - (((props.levelMax - props.levelMin) / 100) * 6)} {...labelStyles}>
          <HStack
            justifySelf={"flex-start"}
            alignItems={"center"}
            spacing="0" 
            textAlign='center'
          >
            <Spacer />
            <span>{props.levelMin}{props.suffix}</span>
            <Spacer />
          </HStack>
        </SliderMark>
        <SliderMark
          value={props.value}
        >
          <Box>
            <VStack>
              <>
                {(props.displayValue > props.value && props.value >= 0) ? <HiChevronUp color={getMarkColor()} /> : ''}
              </>
              <HStack
                justifySelf={"flex-start"}
                alignItems={"center"}
                spacing="0" 
                textAlign='center'
                bg={getMarkColor()}
                {...markStyles}
              >
                <Spacer />
                <span>{props.displayValue}{props.suffix}</span>
                <Spacer />
              </HStack>
              <>
                {(props.displayValue < props.value || props.value < 0) ? <HiChevronDown color={getMarkColor()} /> : ''}
              </>
            </VStack>
          </Box>
        </SliderMark>
      </Slider>
      <Heading mt='12' as='h5' fontSize={{base: '11px', sm: '11px', md: '16px'}} size='sm' color='white' height='85px' width={['60px', '100px']}>{props.title}</Heading>
    </Box>
  )
}
