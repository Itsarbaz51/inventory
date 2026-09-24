"use client";

import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

import Button from "@/components/ui/Button";
import InputField from "@/components/ui/InputField";

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Login Data:", formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Email */}
      <InputField
        label="Email"
        name="email"
        type="email"
        placeholder="Enter your email"
        value={formData.email}
        onChange={handleChange}
        leftIcon={<Mail size={18} />}
        required
      />

      {/* Password */}
      <InputField
        label="Password"
        name="password"
        type={showPassword ? "text" : "password"}
        placeholder="Enter your password"
        value={formData.password}
        onChange={handleChange}
        leftIcon={<Lock size={18} />}
        rightIcon={showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        onRightIconClick={() => setShowPassword((prev) => !prev)}
        required
      />

      {/* Remember + Forgot */}
      <div className="flex items-center justify-between">
        <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-input accent-primary"
          />

          <span>Remember me</span>
        </label>

        <button
          type="button"
          className="
            text-sm font-medium
            text-primary
            hover:underline
          "
        >
          Forgot password?
        </button>
      </div>

      {/* Submit */}
      <Button type="submit" fullWidth size="lg">
        Sign In
      </Button>
    </form>
  );
}

export default LoginForm;
