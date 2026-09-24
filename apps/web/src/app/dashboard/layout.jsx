"use client";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      {/* Content Area */}
      <div className="flex min-h-screen flex-col lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-30">
          <Header />
        </header>

        {/* Main Content */}
        <main
          className="
            min-h-[calc(100vh-4rem)]
            flex-1
            overflow-x-hidden
            bg-gradient-secondry
            p-4
            sm:p-6
            lg:p-8
          "
        >
          {children}
        </main>
      </div>
    </div>
  );
}
