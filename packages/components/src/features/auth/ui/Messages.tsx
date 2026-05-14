import { Alert, Box } from "@mui/material";
import { UiText } from "@ory/client";

export interface MessageProps {
  message: UiText;
}

export const Message = ({ message }: MessageProps) => {
  return (
    <Alert severity={message.type === "error" ? "error" : "info"}>
      <Box data-testid={`ui/message/${message.id}`}>{message.text}</Box>
    </Alert>
  );
};

export interface MessagesProps {
  messages?: Array<UiText>;
}

export const Messages = ({ messages }: MessagesProps) => {
  if (!messages) {
    // No messages? Do nothing.
    return null;
  }

  return (
    <div>
      {messages.map(message => (
        <Message
          key={message.id}
          message={message}
        />
      ))}
    </div>
  );
};
