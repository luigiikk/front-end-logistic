import React from "react";
import type { ReactNode } from "react";
import { HeaderLayout } from "./header";

interface EntityLayoutProps {
  children: ReactNode;
  title: string;
  hideBackButton?: boolean;
}

export const EntityLayout: React.FC<EntityLayoutProps> = ({
  children,
  title,
  hideBackButton,
}) => {
  return (
    <div className="flex flex-col h-screen w-full bg-[#EEF5FB] font-sans">
      <HeaderLayout title={title} hideBackButton={hideBackButton} />
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};