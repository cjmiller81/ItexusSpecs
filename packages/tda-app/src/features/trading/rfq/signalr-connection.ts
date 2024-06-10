import * as signalR from "@microsoft/signalr";

const backendApiUrl = process.env.BACKEND_API_URL ?? 'http://localhost:5000'

class Connector {
    private connection: signalR.HubConnection;
    public events: (onMessageReceived: (message: string) => void) => void;
    static instance: Connector;
    constructor() {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(`${backendApiUrl}/events/orders`)
            .withAutomaticReconnect()
            .build();
        this.connection.start().catch(err => console.error('SignalR Connection Error:', err));
        this.events = (onMessageReceived) => {
            this.connection.on("ReceiveOrderUpdate", (message) => {
                onMessageReceived(message);
            });
        };
    }
    public newMessage = (messages: string) => {
        this.connection.send("newMessage", "foo", messages).then(_x => console.log("sent"))
    }
    public static getInstance(): Connector {
        if (!Connector.instance)
            Connector.instance = new Connector();
        return Connector.instance;
    }
}
export default Connector.getInstance;
