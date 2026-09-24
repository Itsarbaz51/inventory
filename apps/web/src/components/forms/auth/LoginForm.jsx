"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";

import Button from "@/components/ui/Button";
import InputField from "@/components/ui/InputField";

import { setCredentials } from "@/store/slices/authSlice";
import useLogin from "@/hooks/auth/useLogin";

function LoginForm() {
  const router = useRouter();
  const dispatch = useDispatch();

  const login = useLogin();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    identify: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
      general: "",
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.identify.trim()) {
      newErrors.identify = "Email/Username/Phone is required.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    setErrors({});

    login.mutate(
      {
        identify: formData.identify.trim(),
        password: formData.password,
      },
      {
        onSuccess: (response) => {
          const user = response?.data?.user;

          dispatch(
            setCredentials({
              user,
            }),
          );

          router.replace("/dashboard");
        },

        onError: (error) => {
          const message =
            error?.response?.data?.message ||
            "Invalid email/username/phone or password.";

          setErrors({
            general: message,
          });
        },
      },
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {/* General Error */}

      {errors.general && (
        <div
          className="
            flex items-start gap-2
            rounded-lg
            border border-destructive/20
            bg-destructive/5
            px-3 py-2.5
            text-sm text-destructive
          "
        >
          <AlertCircle
            size={17}
            className="mt-0.5 shrink-0"
          />

          <span>{errors.general}</span>
        </div>
      )}

      {/* identify */}

      <InputField
        label="Email / Username / Phone"
        name="identify"
        type="text"
        placeholder="Enter email, username or phone"
        value={formData.identify}
        onChange={handleChange}
        error={errors.identify}
        leftIcon={<Mail size={18} />}
        required
        disabled={login.isPending}
      />

      {/* Password */}

      <InputField
        label="Password"
        name="password"
        type={showPassword ? "text" : "password"}
        placeholder="Enter your password"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
        leftIcon={<Lock size={18} />}
        rightIcon={
          showPassword ? (
            <EyeOff size={18} />
          ) : (
            <Eye size={18} />
          )
        }
        onRightIconClick={() =>
          setShowPassword((prev) => !prev)
        }
        required
        disabled={login.isPending}
      />

      {/* Remember + Forgot */}

      <div className="flex items-center justify-between gap-3">
        <label
          className="
            flex cursor-pointer
            items-center gap-2
            text-sm text-muted-foreground
          "
        >
          <input
            type="checkbox"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleChange}
            disabled={login.isPending}
            className="
              h-4 w-4
              rounded
              border-input
              accent-primary
            "
          />

          <span>Remember me</span>
        </label>

        <button
          type="button"
          disabled={login.isPending}
          className="
            text-sm
            font-medium
            text-primary
            hover:underline
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          Forgot password?
        </button>
      </div>

      {/* Submit */}

      <Button
        type="submit"
        fullWidth
        size="lg"
        loading={login.isPending}
        disabled={login.isPending}
      >
        Sign In
      </Button>
    </form>
  );
}

export default LoginForm;