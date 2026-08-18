import { ReactNode } from "react";

type BadgeProps = {
  title: string;
  parameter: number | string;
  icon: ReactNode;
  badge?: string;
  className?: string;
};

export function Badge({ title, parameter, icon, badge, className }: BadgeProps) {
  return (
    <div
      className={`w-full h-full bg-[#FAFAFA] border-2 border-border/30 p-4 rounded-2xl  ${className || ''}`}
    >
      <div className="flex items-start justify-between">
        <div className="bg-[#D0E1FB]/50 w-10 h-10 rounded-lg flex items-center justify-center text-darkest-blue">
          {icon}
        </div>
        {badge && (
          <span className="bg-gray-100 text-normal text-xs font-semibold rounded-full px-2 py-0.5">
            {badge}
          </span>
        )}
      </div>
      <div className="mt-8">
        <p className="text-normal text-md font-semibold">{title}</p>
        <p className="text-black text-2xl md:text-3xl lg:text-5xl font-bold break-words">{parameter}</p>
      </div>
    </div>
  );
}
