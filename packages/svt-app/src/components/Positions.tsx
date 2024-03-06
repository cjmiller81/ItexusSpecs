import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  IconButton,
  Input,
  NumberInput,
  NumberInputField,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Select,
  Spinner,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react"
import { HiOutlineTrash } from "react-icons/hi"

import { Position } from "../services/useACF"
import { dateDiffInDays, formatDateString, getMidnightCentralTimeDate } from "../utils"

export default function Positions(props: { positions: Position[]; pendingSync: boolean; needsSave: boolean; dispatch: any }) {
  let positions: Position[] = props.positions
  let pendingSync: boolean = props.pendingSync
  let needsSave: boolean = props.needsSave
  let dispatch: any = props.dispatch

  const mayNotAddAnotherPosition = positions.some((position: Position) => !position.symbol)

  return (
    <Box id="trading-tools-positions-container" mx="auto" w="full" bg="#151C32" py="32px" px="15px">
      <Stack direction={['column', 'row']} justifySelf={"flex-start"} alignItems={"center"} pb="8" spacing="6" w="100%">
        <Heading fontSize="19px" lineHeight="23px" fontFamily="body" textTransform={"uppercase"}>
          Positions
        </Heading>
        <Stack
          direction="row"
          ml="auto !important"
          mr={["auto !important", "0 !important"]}
        >
          <Button
            variant={"primary"}
            fontSize={{ base: '10px', md: '11px', lg: '13px'}}
            disabled={mayNotAddAnotherPosition || pendingSync || needsSave}
            onClick={() => {
              dispatch({ type: "add_position" })
            }}
          >
            Add New
          </Button>
          <Button
            variant={"primary"}
            fontSize={{ base: '10px', md: '11px', lg: '13px'}}
            disabled={!needsSave || pendingSync}
            onClick={() => {
              dispatch({ type: "sync_positions", payload: { positions } })
            }}
          >
            Save
          </Button>
        </Stack>
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
      <TableContainer w="container.lg">
        <Table variant={"positions"}>
          <Thead>
            <Tr>
              <Th pl="5" pr="0">
                Symbol
              </Th>
              <Th pl="5" pr="0">
                Type
              </Th>
              <Th pl="2" pr="0">
                Position
              </Th>
              <Th pl="3" pr="0">
                Exp Date
              </Th>
              <Th pl="0" pr="0">
                DTE
              </Th>
              <Th pl="1" pr="0">
                Strike
              </Th>
              <Th pl="3" isNumeric textAlign="right">
                Trade Price
              </Th>
              <Th pl="3" isNumeric textAlign="right">
                Mark Price
              </Th>
              <Th pl="0">Date Entered</Th>
            </Tr>
          </Thead>
          <Tbody>
            {positions.map((position, index) => (
              <Tr
                key={position.id}
                data-id={position.id}
              >
                <Td pl="5" pr="1">
                  <Popover
                    isOpen={!position.is_valid_symbol && position.error !== null}
                    placement="right-start"
                    trigger="hover"
                  >
                    <PopoverTrigger>
                      <Input
                        variant={"unstyled"}
                        name="symbol"
                        size="md"
                        value={position.symbol.toUpperCase()}
                        color={position.is_valid_symbol ? "" : "red.500"}
                        onBlur={(e) =>
                          dispatch({
                            type: "validate_symbol",
                            payload: {
                              position: {
                                ...position,
                                symbol: e.target.value,
                              },
                            },
                          })
                        }
                        onChange={(e) =>
                          dispatch({
                            type: "invalidate_symbol",
                            payload: {
                              position: {
                                ...position,
                                symbol: e.target.value,
                              },
                            },
                          })
                        }
                      />
                    </PopoverTrigger>
                    <PopoverContent bg="red.500" color="white">
                      <PopoverArrow bg="red.500" />
                      <PopoverBody>{`Error: ${position.error}`}</PopoverBody>
                    </PopoverContent>
                  </Popover>
                </Td>
                <Td pl="1" pr="0">
                  <Flex alignItems="center" layerStyle="positionPillStart" h="full">
                    <Select
                      variant="unstyled"
                      size="sm"
                      w="40px"
                      icon={<span></span>}
                      value={position.trade_type === "shares" ? "shares" : position.call_put}
                      onChange={(e) =>
                        dispatch({
                          type: "set_trade_type",
                          payload: {
                            trade_type: e.target.value === "shares" ? "shares" : "options",
                            call_put: e.target.value === "shares" ? null : (e.target.value as "call" | "put"),
                            id: position.id,
                          },
                        })
                      }
                    >
                      <optgroup label="Options">
                        <option value="call">CALL</option>
                        <option value="put">PUT</option>
                      </optgroup>
                      <option value="shares">Shares</option>
                    </Select>
                    <Text as="span" borderRightWidth="1px" borderRightColor="#323B5A" h="16px" pl="3"></Text>
                  </Flex>
                </Td>
                <Td px="0">
                  <Flex
                    alignItems="center"
                    layerStyle={position.trade_type === "options" ? "positionPillMiddle" : "positionPillEnd"}
                    pl={3}
                    h="full"
                  >
                    <Text as="span" h="16px">
                      <NumberInput
                        id="quantity"
                        name="quantity"
                        max={10000}
                        min={position.call_put ? -10000 : 1}
                        precision={0}
                        step={1}
                        defaultValue={position.quantity}
                        allowMouseWheel={true}
                        clampValueOnBlur={true}
                        keepWithinRange
                        variant="unstyled"
                        fontSize="13px"
                        lineHeight="13px"
                        size="sm"
                        value={position.quantity}
                        onChange={(value) =>
                          dispatch({
                            type: "update_field",
                            payload: {
                              index,
                              id: position.id,
                              key: "quantity",
                              value,
                            },
                          })
                        }
                      >
                        <NumberInputField textAlign="right" maxH="16px" fontSize="13px" w="55px" />
                      </NumberInput>
                    </Text>
                    {position.trade_type !== "shares" && (
                      <Text as="span" borderRightWidth="1px" borderRightColor="#323B5A" h="16px" pl="3"></Text>
                    )}
                  </Flex>
                </Td>

                {position.trade_type === "shares" ? (
                  <>
                    <Td></Td>
                    <Td></Td>
                    <Td></Td>
                  </>
                ) : (
                  <>
                    <Td px="0">
                      <Flex alignItems="center" layerStyle="positionPillMiddle" h="26px" pr="1">
                        <Input
                          height="15px"
                          minHeight="unset"
                          variant={"unstyled"}
                          name="expiration"
                          type="date"
                          value={formatDateString(position.expiration)}
                          onBlur={(e) =>
                            dispatch({
                              type: "validate_option_symbol",
                              payload: {
                                position,
                                key: "expiration",
                                value: e.target.value.replace(/-/g, ""),
                              },
                            })
                          }
                          onChange={(e) =>
                            dispatch({
                              type: "invalidate_option_symbol",
                              payload: {
                                position,
                                key: "expiration",
                                value: e.target.value.replace(/-/g, ""),
                              },
                            })
                          }
                        />
                      </Flex>
                    </Td>
                    <Td px="0">
                      <Flex alignItems="center" layerStyle="positionPillMiddle" h="26px" pl="0">
                        <Text as="span" fontWeight="normal">
                          {`(${dateDiffInDays(
                            getMidnightCentralTimeDate(),
                            getMidnightCentralTimeDate(position.expiration)
                          )}d)`}
                        </Text>
                        <Text
                          as="span"
                          borderRightWidth="1px"
                          borderRightColor="#323B5A"
                          h="16px"
                          pl="3"
                        ></Text>
                      </Flex>
                    </Td>
                    <Td px="0">
                      <Flex alignItems="center" layerStyle="positionPillEnd" h="26px">
                        <Text as="span">
                          <Popover
                            isOpen={!position.is_valid_option && position.error !== null}
                            placement="bottom-start"
                            trigger="hover"
                          >
                            <PopoverTrigger>
                              <NumberInput
                                id="strike_price"
                                name="strike_price"
                                max={10000}
                                min={0}
                                precision={2}
                                step={1}
                                defaultValue={position.strike_price}
                                allowMouseWheel={true}
                                clampValueOnBlur={true}
                                keepWithinRange
                                variant="unstyled"
                                fontSize="13px"
                                lineHeight="13px"
                                size="sm"
                                value={position.strike_price}
                                onBlur={(e) =>
                                  dispatch({
                                    type: "validate_option_symbol",
                                    payload: {
                                      position,
                                      key: "strike_price",
                                      value: e.target.value,
                                    },
                                  })
                                }
                                onChange={(value) =>
                                  dispatch({
                                    type: "invalidate_option_symbol",
                                    payload: {
                                      position,
                                      key: "strike_price",
                                      value,
                                    },
                                  })
                                }
                              >
                                <NumberInputField textAlign="right" maxH="16px" fontSize="13px" w="48px" />
                              </NumberInput>
                            </PopoverTrigger>
                            <PopoverContent bg="red.500" color="white">
                              <PopoverArrow bg="red.500" />
                              <PopoverBody>{`Error: ${position.error}`}</PopoverBody>
                            </PopoverContent>
                          </Popover>
                        </Text>
                      </Flex>
                    </Td>
                  </>
                )}
                <Td>
                  <NumberInput
                    id="trade_price"
                    name="trade_price"
                    max={100000.0}
                    min={0.0}
                    precision={2}
                    step={0.05}
                    allowMouseWheel={true}
                    clampValueOnBlur={true}
                    keepWithinRange
                    variant={"unstyled"}
                    size="md"
                    fontSize="13px"
                    lineHeight="13px"
                    value={position.trade_price}
                    onChange={(value) =>
                      dispatch({
                        type: "update_field",
                        payload: {
                          index,
                          id: position.id,
                          key: "trade_price",
                          value,
                        },
                      })
                    }
                  >
                    <NumberInputField textAlign="right" fontSize="16px" lineHeight="18px" />
                  </NumberInput>
                </Td>
                <Td isNumeric textAlign="right">
                  <Text
                    size="md"
                    color={position.mark_price_prev !== "" && position?.mark_price !== "-"
                      ? (parseFloat(position?.mark_price) > parseFloat(position?.mark_price_prev))
                        ? "springgreen"
                        : ((parseFloat(position?.mark_price) < parseFloat(position?.mark_price_prev) ? "lightcoral" : "white"))
                      : "white"
                    }>
                    {position?.mark_price}
                  </Text>
                </Td>
                <Td pl="1" pr="1">
                  <Input
                    height="15px"
                    minHeight="unset"
                    variant={"unstyled"}
                    name="date_entered"
                    type="date"
                    value={formatDateString(position.date_entered)}
                    onChange={(e) => {
                      dispatch({
                        type: "update_field",
                        payload: {
                          index,
                          id: position.id,
                          key: "date_entered",
                          value: e.target.value.replace(/-/g, ""),
                        },
                      })
                    }}
                  />
                </Td>
                <Td sx={{ bg: "transparent" }}>
                  <IconButton
                    aria-label="Delete Position"
                    size="xs"
                    variant="unstyled"
                    disabled={pendingSync}
                    icon={<Icon as={HiOutlineTrash} boxSize="21px" />}
                    onClick={() => {
                      dispatch({
                        type: "remove_position",
                        payload: { index },
                      })
                    }}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  )
}
