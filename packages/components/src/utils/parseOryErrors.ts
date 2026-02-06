/**
 * Parses Ory error response to extract meaningful error messages
 * @param error - Axios error response from Ory
 * @returns Array of error messages
 */
export function parseOryErrors(error: any): string[] {
  const messages: string[] = [];
  
  try {
    // Check if it's a 400 error with Ory flow data
    if (error?.response?.status === 400 && error?.response?.data?.ui?.nodes) {
      const nodes = error.response.data.ui.nodes;
      
      // Extract messages from all nodes
      nodes.forEach((node: any) => {
        if (node.messages && Array.isArray(node.messages)) {
          node.messages.forEach((message: any) => {
            if (message.type === 'error' && message.text) {
              messages.push(message.text);
            }
          });
        }
      });
    }
    
    // Fallback to general error message if no specific messages found
    if (messages.length === 0) {
      if (error?.response?.data?.error?.reason) {
        messages.push(error.response.data.error.reason);
      } else if (error?.message) {
        messages.push(error.message);
      } else {
        messages.push('An unexpected error occurred');
      }
    }
  } catch (parseError) {
    console.error('Error parsing Ory errors:', parseError);
    messages.push('An unexpected error occurred');
  }
  
  return messages;
}

/**
 * Parses Ory errors and returns a single concatenated message
 * @param error - Axios error response from Ory
 * @returns Concatenated error message
 */
export function parseOryErrorMessage(error: any): string {
  const messages = parseOryErrors(error);
  return messages.join('. ');
}
