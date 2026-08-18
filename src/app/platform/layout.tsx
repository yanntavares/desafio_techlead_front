import Sidebar from "@/components/ui/Sidebar";
import { ReactNode } from "react";

export default function PlatformLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col lg:flex-row h-screen w-full bg-[#F7F9FB] overflow-hidden">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-6 md:p-10 ">
        {children}
      </main>
    </div>
  );
}