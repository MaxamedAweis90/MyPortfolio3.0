import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#0B82EC] focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border border-[#0B82EC]/30 bg-[#0B82EC]/15 text-[#0B82EC] hover:bg-[#0B82EC]/25",
        solid:
          "border-transparent bg-[#0B82EC] text-white hover:bg-[#3B82F6]",
        secondary:
          "border border-borderSubtle bg-surface text-mutedText hover:bg-surface/80",
        destructive:
          "border border-red-500/30 bg-red-500/15 text-red-400 hover:bg-red-500/25",
        outline:
          "border border-borderSubtle text-primaryText",
        success:
          "border border-[#2DD4BF]/30 bg-[#2DD4BF]/15 text-[#2DD4BF] hover:bg-[#2DD4BF]/25",
        teal:
          "border border-[#2DD4BF]/30 bg-[#2DD4BF]/15 text-[#2DD4BF] hover:bg-[#2DD4BF]/25",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
