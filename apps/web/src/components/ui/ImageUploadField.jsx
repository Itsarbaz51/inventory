"use client";

import React, { useEffect, useRef, useState } from "react";
import { ImagePlus, Trash2, Upload } from "lucide-react";

import Button from "@/components/ui/Button";

export default function ImageUploadField({
    label = "Product Image",
    value = "",
    onChange,
    error,
    disabled = false,
    helperText = "PNG, JPG, JPEG or WEBP. Max 5MB.",
    accept = "image/png,image/jpeg,image/jpg,image/webp",
    maxSize = 5 * 1024 * 1024,
}) {
    const inputRef = useRef(null);

    const [preview, setPreview] = useState(value || "");

    useEffect(() => {
        setPreview(value || "");
    }, [value]);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            onChange?.(null, "Please select a valid image file.");
            return;
        }

        if (file.size > maxSize) {
            onChange?.(
                null,
                `Image size cannot exceed ${Math.round(
                    maxSize / (1024 * 1024),
                )}MB.`,
            );

            e.target.value = "";
            return;
        }

        const objectUrl = URL.createObjectURL(file);

        setPreview(objectUrl);

        onChange?.(file, null);
    };

    const handleRemove = () => {
        setPreview("");

        if (inputRef.current) {
            inputRef.current.value = "";
        }

        onChange?.(null, null);
    };

    return (
        <div className="w-full">
            {label && (
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                    {label}
                </label>
            )}

            <div
                className={`
          overflow-hidden rounded-xl border
          ${error
                        ? "border-destructive"
                        : "border-border"
                    }
          bg-background
        `}
            >
                {preview ? (
                    <div className="relative">
                        <div className="flex min-h-52 items-center justify-center bg-muted/20 p-4">
                            <img
                                src={preview}
                                alt="Product preview"
                                className="max-h-64 max-w-full rounded-lg object-contain"
                            />
                        </div>

                        <div className="flex items-center justify-between border-t border-border px-4 py-3">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <ImagePlus size={16} />

                                <span>Image selected</span>
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    disabled={disabled}
                                    onClick={() => inputRef.current?.click()}
                                >
                                    Change
                                </Button>

                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    disabled={disabled}
                                    onClick={handleRemove}
                                    className="text-destructive hover:text-destructive"
                                >
                                    <Trash2 size={16} />
                                    Remove
                                </Button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <button
                        type="button"
                        disabled={disabled}
                        onClick={() => inputRef.current?.click()}
                        className="
              flex min-h-44 w-full
              flex-col items-center justify-center
              gap-3 p-6
              text-center
              transition-colors
              hover:bg-muted/30
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
                    >
                        <div
                            className="
                flex h-12 w-12
                items-center justify-center
                rounded-full
                bg-primary/10
                text-primary
              "
                        >
                            <Upload size={22} />
                        </div>

                        <div>
                            <p className="text-sm font-medium">
                                Click to upload product image
                            </p>

                            <p className="mt-1 text-xs text-muted-foreground">
                                {helperText}
                            </p>
                        </div>
                    </button>
                )}

                <input
                    ref={inputRef}
                    type="file"
                    accept={accept}
                    onChange={handleFileChange}
                    disabled={disabled}
                    className="hidden"
                />
            </div>

            {error && (
                <p className="mt-1 text-xs text-destructive">
                    {typeof error === "string"
                        ? error
                        : error?.message}
                </p>
            )}

            {!error && helperText && preview && (
                <p className="mt-1 text-xs text-muted-foreground">
                    {helperText}
                </p>
            )}
        </div>
    );
}