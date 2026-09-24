import LoginForm from "@/components/forms/auth/LoginForm";
import React from "react";

function LoginModel() {
  return (
    <div className="w-full max-w-md">
      {/* Brand */}
      <div className="mb-8 text-center">
        <div
          className="
            mx-auto mb-4
            flex h-12 w-12
            items-center justify-center
            rounded-xl
            bg-primary
            text-xl font-bold
            text-primary-foreground
          "
        >
          I
        </div>

        <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Sign in to your inventory account
        </p>
      </div>

      {/* Login Card */}
      <div
        className="
          rounded-xl
          border border-border
          bg-card
          p-6
          shadow-sm
        "
      >
        <LoginForm />
      </div>

      {/* Footer */}
      <p className="mt-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Inventory Management System
      </p>
    </div>
  );
}

export default LoginModel;
