import React from "react";

const InputField = ({
  label,
  name,
  type = "text",
  placeholder = "",
  value,
  onChange,
  onBlur,
  error,
  disabled = false,
  required = false,
  readOnly = false,
  className = "",
  inputClassName = "",
  helperText = "",
  leftIcon,
  rightIcon,
  onRightIconClick,
  ...props
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="mb-1.5 block text-sm font-medium text-foreground"
        >
          {label}

          {required && <span className="ml-1 text-destructive">*</span>}
        </label>
      )}

      <div className="relative">
        {leftIcon && (
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {leftIcon}
          </div>
        )}

        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value ?? ""}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          readOnly={readOnly}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${name}-error` : helperText ? `${name}-helper` : undefined
          }
          className={`
  flex h-10 w-full rounded-md border
  bg-background
  px-3 py-2
  text-sm text-foreground
  shadow-sm
  outline-none
  transition-colors
  placeholder:text-muted-foreground

  focus:border-ring
  focus:ring-2
  focus:ring-ring/20

  disabled:cursor-not-allowed
  disabled:opacity-50
  read-only:bg-muted/50

  ${
    error
      ? "border-destructive focus:border-destructive focus:ring-destructive/20"
      : "border-input"
  }

  ${leftIcon ? "pl-10" : ""}
  ${rightIcon ? "pr-10" : ""}

  ${inputClassName}
`}
          {...props}
        />

        {rightIcon && (
          <button
            type="button"
            onClick={onRightIconClick}
            disabled={disabled}
            tabIndex={-1}
            className="
              absolute right-3 top-1/2
              -translate-y-1/2
              text-muted-foreground
              hover:text-foreground
              disabled:pointer-events-none
            "
          >
            {rightIcon}
          </button>
        )}
      </div>

      {error ? (
        <p id={`${name}-error`} className="mt-1 text-xs text-destructive">
          {typeof error === "string" ? error : error?.message}
        </p>
      ) : helperText ? (
        <p id={`${name}-helper`} className="mt-1 text-xs text-muted-foreground">
          {helperText}
        </p>
      ) : null}
    </div>
  );
};

export default InputField;
