import { Input } from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import { useACFMutation } from "../services/useACF"
import { formatDollars, stringToNumbers } from "../utils"

export default function CurrentAccountValue(props: {
  current_account_value: number, 
  dispatch: any 
}) {
  const [accountVal, setAccountVal] = useState(formatDollars(props.current_account_value.toString()))
  const acf = useACFMutation({
    onSuccess: (res: any) => {
      props.dispatch({
        type: "set_user_data",
        payload: {
          user_trading_plan: res.acf.user_trading_plan,
          current_account_value: res.acf.current_account_value
        }
      })
    }
  })

  useEffect(() => {
    setAccountVal(formatDollars(props.current_account_value.toString()))
  }, [props.current_account_value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccountVal(formatDollars(e.target.value))
  }

  const handleBlur = () => {
    acf.mutate({
      current_account_value: stringToNumbers(accountVal),
    })
  }

  return (
    <Input
      variant="unstyled"
      lineHeight="29px"
      color="#00FF8F"
      fontWeight="bold"
      maxW="250px"
      placeholder="$0.00"
      value={accountVal}
      onChange={handleChange}
      onBlur={handleBlur}
      fontSize={{ base: '12px', md: '18px', lg: '25px' }}
    />
  )
}
