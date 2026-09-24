"use client";

import { useDispatch } from "react-redux";
import { showToast } from "@/store/slices/toastSlice";

export default function useToast() {
  const dispatch = useDispatch();

  const success = (message, title = "Success") => {
    dispatch(
      showToast({
        type: "success",
        title,
        message,
      })
    );
  };

  const error = (message, title = "Something went wrong") => {
    dispatch(
      showToast({
        type: "error",
        title,
        message,
      })
    );
  };

  const warning = (message, title = "Warning") => {
    dispatch(
      showToast({
        type: "warning",
        title,
        message,
      })
    );
  };

  const info = (message, title = "Information") => {
    dispatch(
      showToast({
        type: "info",
        title,
        message,
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