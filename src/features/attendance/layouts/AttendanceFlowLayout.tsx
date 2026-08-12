import type { ReactNode } from "react";

import Header from "@/shared/components/Header";

import AttendanceStepper from "../components/AttendanceStepper";

interface Props {
  title: string;

  steps: string[];

  currentStep: number;

  children: ReactNode;
}

export default function AttendanceFlowLayout({
  title,
  steps,
  currentStep,
  children,
}: Props) {
  return (
    <div className="flex h-dvh flex-col animate-slide-up-ios">
      <Header title={title} />
      <div className="flex flex-1 min-h-0 flex-col bg-white p-5 rounded-t-2xl space-y-4">
        <AttendanceStepper
          steps={steps}
          currentStep={currentStep}
        />
        <div className="min-h-0 flex-1 overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}