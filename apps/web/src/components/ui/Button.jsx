import React from "react";

const Button = ({
  children,
  type = "button",
  variant = "primary",
  size = "default",
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  onClick,
  className = "",
  ...props
}) => {
  const variants = {
    primary: `
      bg-primary
      text-primary-foreground
      hover:bg-primary/90
    `,

    secondary: `
      bg-secondary
      text-secondary-foreground
      hover:bg-secondary/80
    `,

    outline: `
      border border-input
      bg-background
      text-foreground
      hover:bg-accent
      hover:text-accent-foreground
    `,

    ghost: `
      bg-transparent
      text-foreground
      hover:bg-accent
      hover:text-accent-foreground
    `,

    destructive: `
      bg-destructive
      text-white
      hover:bg-destructive/90
    `,

    success: `
      bg-green-600
      text-white
      hover:bg-green-600/90
    `,
  };

  const sizes = {
    sm: "h-8 px-3 text-xs rounded-md",
    default: "h-10 px-4 text-sm rounded-md",
    lg: "h-11 px-6 text-base rounded-md",
    icon: "h-10 w-10 rounded-md p-0",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
      inline-flex items-center justify-center gap-2
      whitespace-nowrap font-medium
       transition-colors
      outline-none
      focus-visible:ring-2
      focus-visible:ring-ring
      focus-visible:ring-offset-2
      disabled:pointer-events-none
      disabled:opacity-50
      cursor-pointer

      ${variants[variant] || variants.primary}
      ${sizes[size] || sizes.default}

      ${fullWidth ? "w-full" : ""}
      ${className}
    `}
      {...props}
    >
      {loading ? (
        <>
          <span
            className="
              h-4 w-4
              animate-spin
              rounded-full
              border-2
              border-current
              border-t-transparent
            "
          />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {leftIcon && <span>{leftIcon}</span>}

          {children}

          {rightIcon && <span>{rightIcon}</span>}
        </>
      )}
    </button>
  );
};

export default Button;
