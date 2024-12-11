import * as signalR from "@microsoft/signalr"
import { useEffect, useRef } from "react"

class Connector {
  private connection: signalR.HubConnection
  static instance: Connector
  constructor() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/events/orders`)
      .withAutomaticReconnect()
      .build()
    this.connection.start().catch(err => console.error("SignalR Connection Error:", err))
  }
  public on = (eventType: string, handler: (...args: any[]) => void) => {
    this.connection.on(eventType, handler)
  }

  public off = (eventType: string, handler: (...args: any[]) => void) => {
    this.connection.off(eventType, handler)
  }

  public newMessage = (messages: string) => {
    this.connection.send("newMessage", "foo", messages).then(_x => console.log("sent"))
  }
  public static getInstance(): Connector {
    if (!Connector.instance) Connector.instance = new Connector()
    return Connector.instance
  }
}

export const useSignalR = (eventType: string, handler: (...args: any[]) => void) => {
  const handlerRef = useRef(handler)
  useEffect(() => {
    handlerRef.current = handler
  }, [handler])

  useEffect(() => {
    const eventHandler = (...args: any[]) => {
      handlerRef.current(...args)
    }
    Connector.getInstance().on(eventType, eventHandler)
    return () => {
      Connector.getInstance().off(eventType, eventHandler)
    }
  }, [])
}

export default Connector.getInstance
