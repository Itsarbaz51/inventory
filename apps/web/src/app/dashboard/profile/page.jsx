"use client";

import React, { useEffect, useState } from "react";
import {
    UserRound,
    Building2,
    Mail,
    Phone,
    ShieldCheck,
    CalendarDays,
    Clock3,
    Pencil,
    Save,
    X,
    MapPin,
    Hash,
    FileText,
    Globe,
} from "lucide-react";
import { useSelector } from "react-redux";

import Button from "@/components/ui/Button";
import InputField from "@/components/ui/InputField";
import SelectField from "@/components/ui/SelectField";
import PageHeader from "@/components/ui/PageHeader";
import LoadingState from "@/components/ui/LoadingState";
import EmptyState from "@/components/ui/EmptyState";

import { formatDate } from "@/lib/utils";

export default function ProfilePage() {
    // ==================================================
    // CURRENT USER FROM REDUX
    // ==================================================

    const currentUser = useSelector((state) => state.auth?.user);

    const tenant = currentUser?.tenant;

    // ==================================================
    // EDIT STATES
    // ==================================================

    const [userEditing, setUserEditing] = useState(false);
    const [tenantEditing, setTenantEditing] = useState(false);

    // ==================================================
    // FORM STATES
    // ==================================================

    const [userForm, setUserForm] = useState({
        name: "",
        email: "",
        phone: "",
    });

    const [tenantForm, setTenantForm] = useState({
        name: "",
        businessName: "",
        businessType: "",
        email: "",
        phone: "",
        gstNumber: "",
        panNumber: "",
        address: "",
        city: "",
        state: "",
        country: "",
        pincode: "",
    });

    // ==================================================
    // INITIALIZE FORMS
    // ==================================================

    useEffect(() => {
        if (!currentUser) return;

        setUserForm({
            name: currentUser.name || "",
            email: currentUser.email || "",
            phone: currentUser.phone || "",
        });

        setTenantForm({
            name: tenant?.name || "",
            businessName: tenant?.businessName || "",
            businessType: tenant?.businessType || "",
            email: tenant?.email || "",
            phone: tenant?.phone || "",
            gstNumber: tenant?.gstNumber || "",
            panNumber: tenant?.panNumber || "",
            address: tenant?.address || "",
            city: tenant?.city || "",
            state: tenant?.state || "",
            country: tenant?.country || "",
            pincode: tenant?.pincode || "",
        });
    }, [currentUser, tenant]);

    // ==================================================
    // USER FORM
    // ==================================================

    const handleUserChange = (e) => {
        const { name, value } = e.target;

        setUserForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleUserEdit = () => {
        setUserEditing(true);
    };

    const handleUserCancel = () => {
        setUserForm({
            name: currentUser?.name || "",
            email: currentUser?.email || "",
            phone: currentUser?.phone || "",
        });

        setUserEditing(false);
    };

    const handleUserSubmit = async (e) => {
        e.preventDefault();

        // ==================================================
        // TODO: USER UPDATE API
        // ==================================================

        /*
        await updateCurrentUser({
            name: userForm.name,
            email: userForm.email,
            phone: userForm.phone,
        });
        */

        console.log("TODO - Update User:", userForm);

        setUserEditing(false);
    };

    // ==================================================
    // TENANT FORM
    // ==================================================

    const handleTenantChange = (e) => {
        const { name, value } = e.target;

        setTenantForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleTenantEdit = () => {
        setTenantEditing(true);
    };

    const handleTenantCancel = () => {
        setTenantForm({
            name: tenant?.name || "",
            businessName: tenant?.businessName || "",
            businessType: tenant?.businessType || "",
            email: tenant?.email || "",
            phone: tenant?.phone || "",
            gstNumber: tenant?.gstNumber || "",
            panNumber: tenant?.panNumber || "",
            address: tenant?.address || "",
            city: tenant?.city || "",
            state: tenant?.state || "",
            country: tenant?.country || "",
            pincode: tenant?.pincode || "",
        });

        setTenantEditing(false);
    };

    const handleTenantSubmit = async (e) => {
        e.preventDefault();

        // ==================================================
        // TODO: TENANT UPDATE API
        // ==================================================

        /*
        await updateTenant(currentUser.tenantId, tenantForm);
        */

        console.log("TODO - Update Tenant:", {
            tenantId: currentUser?.tenantId,
            ...tenantForm,
        });

        setTenantEditing(false);
    };

    // ==================================================
    // LOADING
    // ==================================================

    if (currentUser === undefined) {
        return <LoadingState message="Loading profile..." />;
    }

    // ==================================================
    // EMPTY
    // ==================================================

    if (!currentUser) {
        return (
            <EmptyState
                icon={UserRound}
                title="Profile not found"
                description="Unable to load your profile information."
            />
        );
    }

    // ==================================================
    // PAGE
    // ==================================================

    return (
        <div className="mx-auto w-full max-w-5xl space-y-6">
            {/* ==================================================
                PAGE HEADER
            ================================================== */}

            <PageHeader
                icon={UserRound}
                title="My Profile"
                description="Manage your account and business information."
                secondaryAction={{
                    label: currentUser.status,
                    variant: "outline",
                    disabled: true,
                }}
            />

            {/* ==================================================
                PERSONAL INFORMATION
            ================================================== */}

            <form
                onSubmit={handleUserSubmit}
                className="
                    rounded-2xl
                    border border-border
                    bg-card
                    p-5
                    shadow-sm
                    sm:p-6
                "
            >
                <PageHeader
                    icon={UserRound}
                    title="Personal Information"
                    description="Your account and contact information."
                    primaryAction={
                        !userEditing
                            ? {
                                label: "Edit",
                                icon: <Pencil size={15} />,
                                variant: "outline",
                                onClick: handleUserEdit,
                            }
                            : {
                                label: "Cancel",
                                icon: <X size={15} />,
                                variant: "ghost",
                                onClick: handleUserCancel,
                            }
                    }
                />

                <div className="mt-6 grid gap-5 md:grid-cols-2">
                    <InputField
                        label="Full Name"
                        name="name"
                        value={userForm.name}
                        onChange={handleUserChange}
                        disabled={!userEditing}
                        leftIcon={<UserRound size={17} />}
                        required
                    />

                    <InputField
                        label="Email"
                        name="email"
                        type="email"
                        value={userForm.email}
                        onChange={handleUserChange}
                        disabled={!userEditing}
                        leftIcon={<Mail size={17} />}
                        required
                    />

                    <InputField
                        label="Phone"
                        name="phone"
                        type="tel"
                        value={userForm.phone}
                        onChange={handleUserChange}
                        disabled={!userEditing}
                        leftIcon={<Phone size={17} />}
                    />

                    <InputField
                        label="Role"
                        value={currentUser.role?.name || ""}
                        disabled
                        leftIcon={<ShieldCheck size={17} />}
                    />
                </div>

                {userEditing && (
                    <div className="mt-6 flex justify-end border-t border-border pt-5">
                        <Button
                            type="submit"
                            leftIcon={<Save size={16} />}
                        >
                            Save Changes
                        </Button>
                    </div>
                )}
            </form>

            {/* ==================================================
                BUSINESS INFORMATION
            ================================================== */}

            <form
                onSubmit={handleTenantSubmit}
                className="
                    rounded-2xl
                    border border-border
                    bg-card
                    p-5
                    shadow-sm
                    sm:p-6
                "
            >
                <PageHeader
                    icon={Building2}
                    title="Business Information"
                    description="Information about your current tenant/business."
                    primaryAction={
                        !tenantEditing
                            ? {
                                label: "Edit",
                                icon: <Pencil size={15} />,
                                variant: "outline",
                                onClick: handleTenantEdit,
                            }
                            : {
                                label: "Cancel",
                                icon: <X size={15} />,
                                variant: "ghost",
                                onClick: handleTenantCancel,
                            }
                    }
                />

                <div className="mt-6 grid gap-5 md:grid-cols-2">
                    {/* Tenant Name */}

                    <InputField
                        label="Tenant Name"
                        name="name"
                        value={tenantForm.name}
                        onChange={handleTenantChange}
                        disabled={!tenantEditing}
                        leftIcon={<Building2 size={17} />}
                        required
                    />

                    {/* Business Name */}

                    <InputField
                        label="Business Name"
                        name="businessName"
                        value={tenantForm.businessName}
                        onChange={handleTenantChange}
                        disabled={!tenantEditing}
                        leftIcon={<Building2 size={17} />}
                        required
                    />

                    {/* Business Type */}

                    <SelectField
                        label="Business Type"
                        name="businessType"
                        value={tenantForm.businessType}
                        onChange={handleTenantChange}
                        disabled={!tenantEditing}
                        options={[
                            {
                                value: "PRIVATE_LIMITED",
                                label: "Private Limited",
                            },
                            {
                                value: "PUBLIC_LIMITED",
                                label: "Public Limited",
                            },
                            {
                                value: "PARTNERSHIP",
                                label: "Partnership",
                            },
                            {
                                value: "LLP",
                                label: "LLP",
                            },
                            {
                                value: "PROPRIETORSHIP",
                                label: "Proprietorship",
                            },
                            {
                                value: "OTHER",
                                label: "Other",
                            },
                        ]}
                    />

                    {/* Business Email */}

                    <InputField
                        label="Business Email"
                        name="email"
                        type="email"
                        value={tenantForm.email}
                        onChange={handleTenantChange}
                        disabled={!tenantEditing}
                        leftIcon={<Mail size={17} />}
                    />

                    {/* Business Phone */}

                    <InputField
                        label="Business Phone"
                        name="phone"
                        type="tel"
                        value={tenantForm.phone}
                        onChange={handleTenantChange}
                        disabled={!tenantEditing}
                        leftIcon={<Phone size={17} />}
                    />

                    {/* GST */}

                    <InputField
                        label="GST Number"
                        name="gstNumber"
                        value={tenantForm.gstNumber}
                        onChange={handleTenantChange}
                        disabled={!tenantEditing}
                        leftIcon={<FileText size={17} />}
                        placeholder="Enter GST number"
                    />

                    {/* PAN */}

                    <InputField
                        label="PAN Number"
                        name="panNumber"
                        value={tenantForm.panNumber}
                        onChange={handleTenantChange}
                        disabled={!tenantEditing}
                        leftIcon={<FileText size={17} />}
                        placeholder="Enter PAN number"
                    />

                    {/* Address */}

                    <InputField
                        label="Address"
                        name="address"
                        value={tenantForm.address}
                        onChange={handleTenantChange}
                        disabled={!tenantEditing}
                        leftIcon={<MapPin size={17} />}
                        placeholder="Enter business address"
                    />

                    {/* City */}

                    <InputField
                        label="City"
                        name="city"
                        value={tenantForm.city}
                        onChange={handleTenantChange}
                        disabled={!tenantEditing}
                        leftIcon={<MapPin size={17} />}
                        placeholder="Enter city"
                    />

                    {/* State */}

                    <InputField
                        label="State"
                        name="state"
                        value={tenantForm.state}
                        onChange={handleTenantChange}
                        disabled={!tenantEditing}
                        leftIcon={<MapPin size={17} />}
                        placeholder="Enter state"
                    />

                    {/* Country */}

                    <InputField
                        label="Country"
                        name="country"
                        value={tenantForm.country}
                        onChange={handleTenantChange}
                        disabled={!tenantEditing}
                        leftIcon={<Globe size={17} />}
                        placeholder="Enter country"
                    />

                    {/* Pincode */}

                    <InputField
                        label="Pincode"
                        name="pincode"
                        value={tenantForm.pincode}
                        onChange={handleTenantChange}
                        disabled={!tenantEditing}
                        leftIcon={<Hash size={17} />}
                        placeholder="Enter pincode"
                    />

                    {/* Tenant ID */}

                    <InputField
                        label="Tenant ID"
                        value={currentUser.tenantId || ""}
                        disabled
                    />
                </div>

                {/* Tenant Status */}

                <div className="mt-5 flex items-center justify-between rounded-xl border border-border bg-muted/20 px-4 py-3">
                    <div>
                        <p className="text-xs font-medium text-foreground">
                            Tenant Status
                        </p>

                        <p className="mt-0.5 text-xs text-muted-foreground">
                            Current status of this business account
                        </p>
                    </div>

                    <span
                        className="
                            rounded-full
                            border
                            border-green-500/20
                            bg-green-500/10
                            px-3
                            py-1
                            text-xs
                            font-medium
                            text-green-600
                        "
                    >
                        {tenant?.status || "UNKNOWN"}
                    </span>
                </div>

                {tenantEditing && (
                    <div className="mt-6 flex justify-end border-t border-border pt-5">
                        <Button
                            type="submit"
                            leftIcon={<Save size={16} />}
                        >
                            Save Business
                        </Button>
                    </div>
                )}
            </form>

            {/* ==================================================
                ACCOUNT DETAILS
            ================================================== */}

            <div
                className="
                    rounded-2xl
                    border border-border
                    bg-card
                    p-5
                    shadow-sm
                    sm:p-6
                "
            >
                <PageHeader
                    icon={Clock3}
                    title="Account Details"
                    description="Basic account activity information."
                />

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    {/* Created */}

                    <div className="rounded-xl border border-border bg-muted/20 p-4">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <CalendarDays size={15} />

                            <span className="text-xs">
                                Account Created
                            </span>
                        </div>

                        <p className="mt-2 text-sm font-medium">
                            {formatDate(currentUser.createdAt)}
                        </p>
                    </div>

                    {/* Last Login */}

                    <div className="rounded-xl border border-border bg-muted/20 p-4">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock3 size={15} />

                            <span className="text-xs">
                                Last Login
                            </span>
                        </div>

                        <p className="mt-2 text-sm font-medium">
                            {formatDate(currentUser.lastLoginAt)}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}