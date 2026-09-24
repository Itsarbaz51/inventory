"use client";

import React, { useEffect } from "react";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  X,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { removeToast } from "@/store/slices/toastSlice";

const toastConfig = {
  success: {
    icon: CheckCircle2,
    iconClass: "text-emerald-500",
    progressClass: "bg-emerald-500",
  },

  error: {
    icon: XCircle,
    iconClass: "text-destructive",
    progressClass: "bg-destructive",
  },

  warning: {
    icon: AlertTriangle,
    iconClass: "text-amber-500",
    progressClass: "bg-amber-500",
  },

  info: {
    icon: Info,
    iconClass: "text-primary",
    progressClass: "bg-primary",
  },
};

function ToastItem({ toast }) {
  const dispatch = useDispatch();

  const config = toastConfig[toast.type] || toastConfig.info;
  const Icon = config.icon;

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(removeToast(toast.id));
    }, toast.duration);

    return () => clearTimeout(timer);
  }, [dispatch, toast.id, toast.duration]);

  return (
    <div
      className="
        relative
        w-[calc(100vw-2rem)]
        max-w-sm
        overflow-hidden
        rounded-xl
        border border-border
        bg-card
        p-4
        shadow-xl
        animate-in
        slide-in-from-right-5
        fade-in
        duration-200
      "
    >
      <div className="flex items-start gap-3">
        <div className="shrink-0 pt-0.5">
          <Icon
            size={20}
            strokeWidth={2}
            className={config.iconClass}
          />
        </div>

        <div className="min-w-0 flex-1">
          {toast.title && (
            <p className="text-sm font-semibold text-foreground">
              {toast.title}
            </p>
          )}

          {toast.message && (
            <p className="mt-0.5 text-sm leading-5 text-muted-foreground">
              {toast.message}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={() => dispatch(removeToast(toast.id))}
          className="
            shrink-0
            rounded-md
            p-1
            text-muted-foreground
            transition
            hover:bg-muted
            hover:text-foreground
          "
          aria-label="Close notification"
        >
          <X size={15} />
        </button>
      </div>

      <div
        className={`
          absolute
          bottom-0
          left-0
          h-0.5
          ${config.progressClass}
        `}
        style={{
          width: "100%",
          animation: `toast-progress ${toast.duration}ms linear forwards`,
        }}
      />
    </div>
  );
}

export default function Toast() {
  const toasts = useSelector((state) => state.toast.toasts);

  return (
    <div
      className="
        pointer-events-none
        fixed
        right-4
        top-4
        z-[9999]
        flex
        w-auto
        flex-col
        items-end
        gap-3
      "
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} />
        </div>
      ))}
    </div>
  );
}