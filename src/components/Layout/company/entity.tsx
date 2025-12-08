import React from "react";
import type { ReactNode } from "react";
import { HeaderLayout } from "./header";

interface EntityLayoutProps {
  children: ReactNode;
  title: string; // título dinâmico
}

export const EntityLayout: React.FC<EntityLayoutProps> = ({
  children,
  title,
}) => {
  return (
    <div className="flex flex-col h-screen w-full bg-gray-200 font-sans">
      <HeaderLayout title={title} />
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 p-8 flex justify-center items-center overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};