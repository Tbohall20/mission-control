"use client";

import "./globals.css";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import SeedInitializer from "@/components/SeedInitializer";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Mission Control ⚡</title>
        <meta name="description" content="Tyler's Business Operations Command Center" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body>
        <ConvexProvider client={convex}>
          <SeedInitializer />
          <div className="flex h-screen overflow-hidden" style={{ background: "#0a0a0a" }}>
            {/* Sidebar — desktop only */}
            <div className="hidden md:flex">
              <Sidebar />
            </div>

            {/* Main content */}
            <div className="flex flex-col flex-1 overflow-hidden">
              <TopBar />
              {/* pb-16 on mobile makes room for bottom nav */}
              <main className="flex-1 overflow-auto p-3 md:p-6 pb-20 md:pb-6">
                {children}
              </main>
            </div>
          </div>

          {/* Bottom nav — mobile only */}
          <BottomNav />
        </ConvexProvider>
      </body>
    </html>
  );
}
