import axios from "axios";

const FALLBACK_MESSAGE = "Something went wrong. Please try again.";

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { message?: unknown }
      | undefined;

    const message = data?.message;

    if (typeof message === "string" && message.trim()) {
      return message;
    }

    // No response at all: the browser could not reach the API.
    if (!error.response) {
      return "Unable to reach the server. Check your connection and try again.";
    }

    // A response with no message is not one of our API errors - our error
    // handler always sends JSON. It is a proxy or gateway failure, which in
    // development almost always means the API server is not running.
    return "The server is not responding. Please try again in a moment.";
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return FALLBACK_MESSAGE;
}
