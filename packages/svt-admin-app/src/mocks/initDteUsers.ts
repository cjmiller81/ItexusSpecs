import { IDteUser } from "@/features/strategies/dte/users/iDteUser";

export const initDteUsers: IDteUser[] = [
    {
      "id": "WP1234",
      "exchangeUsername": "tasty1234",
      "email": "tasty1234@gmail.com",
      "accountNumber": "FFE32324",
      "botStatus": "flat",
      "lastFill": 342343,
      "fillTime": new Date(),
      "openQty": 3,
      "connectionStatus": "Disconnected",
    },
    {
      "id": "WP5678",
      "exchangeUsername": "tasty5678",
      "email": "tasty5678@gmail.com",
      "accountNumber": "RRTT23234",
      "botStatus": "error",
      "lastFill": 43434.5454,
      "fillTime": new Date(),
      "openQty": 0,
      "connectionStatus": "Connected",
    }
  ]
  