import LoginModel from "@/components/models/auth/LoginModel";
import React from "react";

function Page() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen items-center justify-center px-4 py-8">
        <LoginModel />
      </div>
    </main>
  );
}

export default Page;
