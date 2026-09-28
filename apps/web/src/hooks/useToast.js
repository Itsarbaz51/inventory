"use client";

import { useDispatch } from "react-redux";
import { showToast } from "@/store/slices/toastSlice";

export default function useToast() {
  const dispatch = useDispatch();

  const formatMessage = (message) => {
    // Array: [{ field, message }]
    if (Array.isArray(message)) {
      return message
        .map((item) => {
          if (typeof item === "string") {
            return item;
          }

          if (item?.field && item?.message) {
            return `${item.field}: ${item.message}`;
          }

          return item?.message || "";
        })
        .filter(Boolean)
        .join("\n");
    }

    // String
    if (typeof message === "string") {
      return message;
    }

    // Object: { message: "..." }
    if (message?.message) {
      return message.message;
    }

    return "";
  };

  const success = (message, title = "Success") => {
    dispatch(
      showToast({
        type: "success",
        title,
        message: formatMessage(message),
      })
    );
  };

  const error = (message, title = "Something went wrong") => {
    dispatch(
      showToast({
        type: "error",
        title,
        message: formatMessage(message),
      })
    );
  };

  const warning = (message, title = "Warning") => {
    dispatch(
      showToast({
        type: "warning",
        title,
        message: formatMessage(message),
      })
    );
  };

  const info = (message, title = "Information") => {
    dispatch(
      showToast({
        type: "info",
        title,
        message: formatMessage(message),
      })
    );
  };

  return {
    success,
    error,
    warning,
    info,
  };
}
