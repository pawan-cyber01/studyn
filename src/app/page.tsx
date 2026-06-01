"use client";

import dynamic from "next/dynamic";

// Dynamically import with ssr:false to cleanly prevent hydration mismatches
const Onboarding = dynamic(() => import("@/components/os/Onboarding"), { ssr: false });
const BootScreen = dynamic(() => import("@/components/os/BootScreen"), { ssr: false });
const Desktop   = dynamic(() => import("@/components/os/Desktop"),   { ssr: false });

import { useOnboardingStore } from "@/store/useOnboardingStore";

export default function Home() {
  const { isCompleted } = useOnboardingStore();

  return (
    <div className="relative h-screen w-screen bg-black select-none overflow-hidden">
      {!isCompleted && <Onboarding />}
      {isCompleted && (
        <>
          <BootScreen />
          <Desktop />
        </>
      )}
    </div>
  );
}
