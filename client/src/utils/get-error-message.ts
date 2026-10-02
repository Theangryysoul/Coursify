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

    if (!error.response) {
      return "Unable to reach the server. Check your connection and try again.";
    }

    return FALLBACK_MESSAGE;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return FALLBACK_MESSAGE;
}
